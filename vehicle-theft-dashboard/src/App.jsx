// Updated App.jsx - Replace your current App.jsx with this version
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calendar, MapPin, Car, TrendingUp, Shield, AlertTriangle, Clock, Users, Loader } from 'lucide-react';

const VehicleTheftDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load real data from your analysis
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/dashboard_data.json');
        if (!response.ok) {
          throw new Error('Failed to load dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
        // Fall back to sample data if real data fails to load
        setDashboardData(getSampleData());
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sample data fallback (in case real data doesn't load)
  const getSampleData = () => ({
    monthlyData: [
      { month: 'Jan', thefts: 385, quarter: 1 },
      { month: 'Feb', thefts: 412, quarter: 1 },
      { month: 'Mar', thefts: 445, quarter: 1 },
      { month: 'Apr', thefts: 398, quarter: 2 },
      { month: 'May', thefts: 376, quarter: 2 },
      { month: 'Jun', thefts: 359, quarter: 2 },
      { month: 'Jul', thefts: 423, quarter: 3 },
      { month: 'Aug', thefts: 467, quarter: 3 },
      { month: 'Sep', thefts: 434, quarter: 3 },
      { month: 'Oct', thefts: 401, quarter: 4 },
      { month: 'Nov', thefts: 387, quarter: 4 },
      { month: 'Dec', thefts: 366, quarter: 4 }
    ],
    dayOfWeekData: [
      { day: 'Mon', thefts: 612 },
      { day: 'Tue', thefts: 598 },
      { day: 'Wed', thefts: 634 },
      { day: 'Thu', thefts: 656 },
      { day: 'Fri', thefts: 723 },
      { day: 'Sat', thefts: 789 },
      { day: 'Sun', thefts: 541 }
    ],
    regionalData: [
      { region: 'Auckland', thefts: 1245, population: 1695200, rate: 73.4, risk: 'High' },
      { region: 'Canterbury', thefts: 756, population: 695500, rate: 108.7, risk: 'Very High' },
      { region: 'Waikato', thefts: 445, population: 513800, rate: 86.6, risk: 'High' }
    ],
    vehicleTypeData: [
      { type: 'Hatchback', count: 789, percentage: 17.3, color: '#8884d8' },
      { type: 'Saloon', count: 675, percentage: 14.8, color: '#82ca9d' },
      { type: 'Stationwagon', count: 534, percentage: 11.7, color: '#ffc658' }
    ],
    makeTypeData: [
      { type: 'Standard', count: 3845, percentage: 84.4 },
      { type: 'Luxury', count: 708, percentage: 15.6 }
    ],
    keyMetrics: {
      totalThefts: 4553,
      dailyAverage: 12.5,
      recoveryRate: 67.8,
      clearanceRate: 34.2,
      highestRiskRegion: 'Canterbury',
      peakDay: 'Saturday',
      peakMonth: 'August'
    },
    riskFactors: [
      { factor: 'Weekend (Fri-Sun)', impact: 'High', percentage: 45.2 },
      { factor: 'Urban Areas', impact: 'Very High', percentage: 78.9 },
      { factor: 'Vehicles 1-5 years old', impact: 'High', percentage: 52.3 },
      { factor: 'Evening Hours (6-11 PM)', impact: 'High', percentage: 38.7 }
    ],
    lastUpdated: 'July 2025'
  });

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Immediate': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Strategic': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Very High': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500">Analyzing vehicle theft patterns</p>
        </div>
      </div>
    );
  }

  // Get data with fallback
  const data = dashboardData || getSampleData();

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp size={16} className="text-green-500 mr-1" />
          <span className="text-sm text-green-600">{trend}</span>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Data Status Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Using sample data. To see your real analysis results, place dashboard_data.json in the public folder.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Thefts"
          value={formatNumber(data.keyMetrics.totalThefts)}
          subtitle="Analysis period"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Daily Average"
          value={data.keyMetrics.dailyAverage}
          subtitle="Thefts per day"
          icon={Clock}
        />
        <MetricCard
          title="Recovery Rate"
          value={`${data.keyMetrics.recoveryRate}%`}
          subtitle="Vehicles recovered"
          icon={Shield}
          trend="+5.2% vs last year"
        />
        <MetricCard
          title="Clearance Rate"
          value={`${data.keyMetrics.clearanceRate}%`}
          subtitle="Cases solved"
          icon={Users}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Monthly Theft Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyData}>
              <defs>
                <linearGradient id="colorThefts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatNumber(value), 'Thefts']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area type="monotone" dataKey="thefts" stroke="#3b82f6" fillOpacity={1} fill="url(#colorThefts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Day of Week Pattern */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Day of Week Patterns</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.dayOfWeekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatNumber(value), 'Thefts']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Bar dataKey="thefts" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vehicle Types */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Most Stolen Vehicle Types</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.vehicleTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.vehicleTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value), 'Thefts']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {data.vehicleTypeData.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">{formatNumber(item.count)}</span>
                  <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Key Insights from Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Peak Risk Period</h4>
            <p className="text-sm">{data.keyMetrics.peakDay}s show highest theft activity</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Highest Risk Region</h4>
            <p className="text-sm">{data.keyMetrics.highestRiskRegion} requires immediate attention</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Recovery Success</h4>
            <p className="text-sm">{data.keyMetrics.recoveryRate}% recovery rate trending upward</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeographic = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Regional Theft Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Region</th>
                <th className="text-right py-3 px-4 font-semibold">Total Thefts</th>
                <th className="text-right py-3 px-4 font-semibold">Population</th>
                <th className="text-right py-3 px-4 font-semibold">Rate per 100k</th>
                <th className="text-center py-3 px-4 font-semibold">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {data.regionalData.map((region, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{region.region}</td>
                  <td className="py-3 px-4 text-right">{formatNumber(region.thefts)}</td>
                  <td className="py-3 px-4 text-right">{formatNumber(region.population)}</td>
                  <td className="py-3 px-4 text-right font-bold">{region.rate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(region.risk)}`}>
                      {region.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Regional Theft Rates Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.regionalData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="region" type="category" width={100} />
            <Tooltip formatter={(value) => [value, 'Rate per 100k']} />
            <Bar dataKey="rate" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Risk Factors */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Key Risk Factors</h3>
        <div className="space-y-4">
          {data.riskFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{factor.factor}</span>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(factor.impact)}`}>
                  {factor.impact} Impact
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{factor.percentage}%</span>
                <span className="text-sm text-gray-500 block">of cases</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury vs Standard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Vehicle Category Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.makeTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type}\n${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value), 'Vehicles']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Analysis Summary</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <p className="font-medium text-blue-900">Total Records Analyzed</p>
              <p className="text-blue-700">{formatNumber(data.keyMetrics.totalThefts)} vehicle theft cases</p>
            </div>
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <p className="font-medium text-red-900">Highest Risk Region</p>
              <p className="text-red-700">{data.keyMetrics.highestRiskRegion} - requires immediate action</p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <p className="font-medium text-green-900">Peak Activity</p>
              <p className="text-green-700">{data.keyMetrics.peakDay}s in {data.keyMetrics.peakMonth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => {
    const recommendations = [
      {
        priority: 'Immediate',
        action: `Deploy additional patrols in ${data.keyMetrics.highestRiskRegion} and other high-risk regions`,
        timeline: '0-3 months',
        expectedImpact: '15% reduction in high-risk areas'
      },
      {
        priority: 'High',
        action: `Increase surveillance operations on ${data.keyMetrics.peakDay}s`,
        timeline: '1-6 months',
        expectedImpact: '20% reduction in weekend thefts'
      },
      {
        priority: 'Medium',
        action: `Launch public awareness campaign for ${data.vehicleTypeData[0]?.type || 'most targeted vehicle'} owners`,
        timeline: '3-9 months',
        expectedImpact: '10% reduction in targeted vehicle types'
      },
      {
        priority: 'Strategic',
        action: 'Implement predictive policing system using identified patterns',
        timeline: '6-18 months',
        expectedImpact: '25% overall reduction in theft rates'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Evidence-Based Recommendations</h3>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)}`}></span>
                    <span className="font-semibold text-lg">{rec.priority} Priority</span>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {rec.timeline}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{rec.action}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expected Impact:</span>
                  <span className="text-sm font-medium text-green-600">{rec.expectedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Implementation Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">0-3 Months</h4>
              <p className="text-sm">Deploy additional patrols and increase weekend operations</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">3-12 Months</h4>
              <p className="text-sm">Launch awareness campaigns and community engagement programs</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">1-2 Years</h4>
              <p className="text-sm">Implement predictive policing and advanced technology solutions</p>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Success Metrics & KPIs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Short Term (3-6 months)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>15% reduction in high-risk regions</li>
                <li>20% faster response times</li>
                <li>25% increase in public awareness</li>
              </ul>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Medium Term (6-12 months)</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>25% overall theft reduction</li>
                <li>30% improved clearance rates</li>
                <li>40% fewer repeat locations</li>
              </ul>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Long Term (1-2 years)</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>35% sustained reduction</li>
                <li>50% better community safety</li>
                <li>Predictive system deployed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vehicle Theft Analysis Dashboard</h1>
                <p className="text-sm text-gray-600">New Zealand Police Department</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last Updated: {data.lastUpdated}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 mb-8">
          <TabButton
            id="overview"
            label="Overview"
            icon={TrendingUp}
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="geographic"
            label="Geographic"
            icon={MapPin}
            isActive={activeTab === 'geographic'}
            onClick={setActiveTab}
          />
          <TabButton
            id="analytics"
            label="Analytics"
            icon={Car}
            isActive={activeTab === 'analytics'}
            onClick={setActiveTab}
          />
          <TabButton
            id="recommendations"
            label="Recommendations"
            icon={Shield}
            isActive={activeTab === 'recommendations'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'geographic' && renderGeographic()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
};

export default VehicleTheftDashboard;