import { supabase } from './supabase';

export interface FOIRequest {
  fullName: string;
  email: string;
  contactNumber: string;
  barangay: string;
  street: string;
  concern: string;
  imageFile?: File | null;
}

export const submitFOIRequest = async (data: FOIRequest): Promise<{ success: boolean; referenceNumber?: string; error?: string }> => {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (data.imageFile) {
      try {
        console.log('Starting image upload via Edge Function...', {
          fileName: data.imageFile.name,
          fileSize: data.imageFile.size,
          fileType: data.imageFile.type,
        });

        // Create FormData for the Edge Function
        const formData = new FormData();
        formData.append('file', data.imageFile);
        formData.append('bucket', 'foi-attachments');

        // Get the Supabase auth token (if available, otherwise use anon)
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        // Call the Edge Function
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const response = await fetch(
          `${supabaseUrl}/functions/v1/upload-image`,
          {
            method: 'POST',
            headers: {
              'Authorization': token ? `Bearer ${token}` : 'Bearer anon',
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Image upload error:', {
            status: response.status,
            message: errorData.error,
          });
          console.warn('⚠️ Image upload failed, continuing form submission without image');
        } else {
          const uploadResult = await response.json();
          imageUrl = uploadResult.publicUrl;
          console.log('✅ Image uploaded successfully:', imageUrl);
        }
      } catch (imageError) {
        console.error('❌ Image upload exception:', {
          error: imageError,
          message: imageError instanceof Error ? imageError.message : 'Unknown error',
        });
        console.warn('⚠️ Continuing form submission without image');
      }
    } else {
      console.log('ℹ️ No image file provided, skipping upload');
    }

    console.log('Submitting form data to database with imageUrl:', imageUrl);

    // Insert the FOI request into the database
    const { data: insertData, error: insertError } = await supabase
      .from('foi_requests')
      .insert({
        full_name: data.fullName,
        email: data.email,
        contact_number: data.contactNumber,
        barangay: data.barangay,
        street: data.street,
        concern: data.concern,
        image_url: imageUrl,
        status: 'pending',
      })
      .select('reference_number')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return { success: false, error: 'Failed to submit request' };
    }

    return {
      success: true,
      referenceNumber: insertData?.reference_number,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};
