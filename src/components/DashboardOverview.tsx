import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, CheckCircle, Activity } from 'lucide-react';

interface ConcernStats {
  [key: string]: number;
}

const CONCERN_TYPES = [
  "General Inquiry",
  "Document Request",
  "Service Complaint",
  "Suggestion",
  "Report",
];

const CONCERN_COLORS: { [key: string]: string } = {
  "General Inquiry": "#3b82f6",    // blue
  "Document Request": "#10b981",   // emerald
  "Service Complaint": "#ef4444",  // red
  "Suggestion": "#f59e0b",         // amber
  "Report": "#8b5cf6",             // violet
};

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalForms: 0,
    pendingForms: 0,
    totalReports: 0,
    resolvedConcerns: 0,
  });
  const [concernStats, setConcernStats] = useState<ConcernStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const { staffMember } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Fetch total forms
      const { count: formsCount } = await supabase
        .from('foi_requests')
        .select('*', { count: 'exact', head: true });

      // Fetch pending forms
      const { count: pendingCount } = await supabase
        .from('foi_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total reports
      const { count: reportsCount } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Fetch resolved concerns
      const { count: resolvedCount } = await supabase
        .from('foi_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved');

      // Fetch concern type statistics
      const { data: foiRequests } = await supabase
        .from('foi_requests')
        .select('concern');

      const newConcernStats: ConcernStats = {};
      CONCERN_TYPES.forEach((type) => {
        newConcernStats[type] = 0;
      });
      newConcernStats['Other'] = 0;

      if (foiRequests) {
        foiRequests.forEach((request: any) => {
          const concern = request.concern;
          if (CONCERN_TYPES.includes(concern)) {
            newConcernStats[concern]++;
          } else {
            newConcernStats['Other'] = (newConcernStats['Other'] || 0) + 1;
          }
        });
      }

      setConcernStats(newConcernStats);
      setStats({
        totalForms: formsCount || 0,
        pendingForms: pendingCount || 0,
        totalReports: reportsCount || 0,
        resolvedConcerns: resolvedCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <Card className={`${color} text-white`}>
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <Icon className="w-10 h-10 opacity-50" />
        </div>
      </CardContent>
    </Card>
  );

  const DoughnutChart = ({
    data,
    colors,
  }: {
    data: { [key: string]: number };
    colors: { [key: string]: string };
  }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 18;

    // Filter out zero values and sort by count descending
    const filteredData = Object.entries(data)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    let cumulativeAngle = -Math.PI / 2; // Start from top
    const segments = filteredData.map(([label, count]) => {
      const percentage = total > 0 ? (count / total) * 100 : 0;
      const sliceAngle = (count / total) * 2 * Math.PI;

      const x1 = 160 + radius * Math.cos(cumulativeAngle);
      const y1 = 160 + radius * Math.sin(cumulativeAngle);
      const endAngle = cumulativeAngle + sliceAngle;
      const x2 = 160 + radius * Math.cos(endAngle);
      const y2 = 160 + radius * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      ].join(' ');

      const result = {
        label,
        count,
        percentage: Math.round(percentage),
        pathData,
        color: colors[label] || '#6b7280',
      };

      cumulativeAngle = endAngle;
      return result;
    });

    return (
      <div className="space-y-8">
        {/* Title - Above the chart */}

        {/* Chart with enhanced design */}
        <div className="flex justify-center">
          <div className="relative">
            <svg width="360" height="360" viewBox="0 0 320 320" className="drop-shadow-2xl filter">
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.05 }} />
                </linearGradient>
              </defs>

              {/* Outer glow circle */}
              <circle
                cx="160"
                cy="160"
                r={radius + 8}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity="0.5"
              />

              {/* Background circle */}
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke="#f0f1f3"
                strokeWidth={strokeWidth}
                filter="url(#shadow)"
              />

              {/* Segments with enhanced styling */}
              {segments.map((segment, idx) => (
                <g key={idx}>
                  <path
                    d={segment.pathData}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                    filter="url(#shadow)"
                    style={{ transition: 'opacity 0.3s ease' }}
                  />
                  {/* Segment highlight */}
                  <path
                    d={segment.pathData}
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </g>
              ))}

              {/* Removed inner filled circle for hollow donut */}

              {/* Center text with improved styling */}
              <text
                x="160"
                y="155"
                textAnchor="middle"
                fontSize="36"
                fontWeight="bold"
                fill="#1f2937"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {total}
              </text>
              <text
                x="160"
                y="175"
                textAnchor="middle"
                fontSize="12"
                fill="#9ca3af"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="500"
              >
                Requests
              </text>
            </svg>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {segments.map((segment, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 transition-all duration-200 border border-gray-100 shadow-sm"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: segment.color,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800">{segment.label}</p>
                <p className="text-[11px] text-gray-600 font-medium">
                  {segment.count} • {segment.percentage}%
                </p>
              </div>
              {/* Progress bar in legend (smaller) */}
              <div className="w-12 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    backgroundColor: segment.color,
                    width: `${segment.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-green-800">Welcome, {staffMember?.full_name}!</h2>
        <p className="text-gray-700 text-lg">
          You are logged in as <span className="font-semibold text-green-700">{staffMember?.role}</span> in the{' '}
          <span className="font-semibold text-green-700">{staffMember?.department}</span> department.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading statistics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Forms"
              value={stats.totalForms}
              icon={FileText}
              color="bg-blue-600"
            />
            <StatCard
              title="Pending Forms"
              value={stats.pendingForms}
              icon={Activity}
              color="bg-yellow-600"
            />
            <StatCard
              title="Published Reports"
              value={stats.totalReports}
              icon={BarChart3}
              color="bg-green-600"
            />
            <StatCard
              title="Resolved Concerns"
              value={stats.resolvedConcerns}
              icon={CheckCircle}
              color="bg-purple-600"
            />
          </div>

          {/* Concern Type Distribution - Doughnut Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Request Distribution by Concern Type</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-xl">
                <DoughnutChart data={concernStats} colors={CONCERN_COLORS} />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
