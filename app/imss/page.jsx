'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Activity,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  Hospital,
  Search,
  Filter,
  ChevronDown,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Datos simulados basados en los CSV analizados
const hospitalData = {
  cirugias: [
    { id: '000003412407HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'AGUSTINA JACQUELINE SIMOTA ARGUELLO', especialidad: 'CIRUGÍA GENERAL', diagnostico: 'Tumor benigno lipomatoso', rezago: 235, delegacion: 'CHIAPAS' },
    { id: '000002012407HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'TERESA DE JESUS MORALES ZUNUN', especialidad: 'CIRUGÍA GENERAL', diagnostico: 'Tumor benigno lipomatoso', rezago: 241, delegacion: 'CHIAPAS' },
    { id: '000001712407HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'DULCE OLIVIA SALGADO BETANZOS', especialidad: 'CIRUGÍA GENERAL', diagnostico: 'Hernia umbilical', rezago: 241, delegacion: 'CHIAPAS' },
    { id: '000007112507HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'KAROL YOLEY HERRERA DIAZ', especialidad: 'OBSTETRICIA', diagnostico: 'Supervisión de embarazo', rezago: 54, delegacion: 'CHIAPAS' },
    { id: '000010712507HF19', hospital: 'HGSMF 19 Huixtla', paciente: 'FLOR SELENY MORALES AGUILAR', especialidad: 'OBSTETRICIA', diagnostico: 'Presentación de nalgas', rezago: 38, delegacion: 'CHIAPAS' },
    
  
  ],
  espera: [
    { clave: '000534912301HD01', hospital: 'HGZ 1 Aguascalientes', paciente: 'CELINA AGUIRRE GARCIA', procedimiento: 'Ureteroscopia', diasEspera: 527, delegacion: 'AGUASCALIENTES' },
    { clave: '000534612301HD01', hospital: 'HGZ 1 Aguascalientes', paciente: 'MARIA GUADALUPE ALONSO ROCHA', procedimiento: 'Colecistectomía laparoscópica', diasEspera: 527, delegacion: 'AGUASCALIENTES' },
    { clave: '000533812301HD01', hospital: 'HGZ 1 Aguascalientes', paciente: 'ARMANDO MARTINEZ LIMON', procedimiento: 'Reparación hernia inguinal', diasEspera: 527, delegacion: 'AGUASCALIENTES' }
  ]
};

const especialidadesData = [
  { name: 'CIRUGÍA GENERAL', value: 45, color: '#3b82f6' },
  { name: 'GINECOLOGÍA', value: 25, color: '#8b5cf6' },
  { name: 'OBSTETRICIA', value: 20, color: '#f59e0b' },
  { name: 'MEDICINA INTERNA', value: 10, color: '#ef4444' },
  // { name: 'TRAUMATOLOGÍA Y ORTOPEDIA', value: 30, color: '#f59e0b' },
  // { name: 'ANGIOLOGÍA Y CIRUGÍA VASCULAR', value: 30, color: '#f59e0b' },
  // { name: 'OTORRINOLARINGOLOGÍA', value: 30, color: '#f59e0b' },
  // { name: 'UROLOGÍA', value: 30, color: '#f59e0b' },
  // { name: 'CIRUGÍA GENERAL EXTENSIÓN HOSPITALARIA', value: 30, color: '#f59e0b' },
  // { name: 'PEDIATRÍA', value: 30, color: '#f59e0b' },
  // { name: 'OFTALMOLOGÍA', value: 30, color: '#f59e0b' },
];

const tendenciaRezago = [
  { mes: 'Ene', promedio: 145, meta: 90 },
  { mes: 'Feb', promedio: 165, meta: 90 },
  { mes: 'Mar', promedio: 178, meta: 90 },
  { mes: 'Abr', promedio: 198, meta: 90 },
  { mes: 'May', promedio: 187, meta: 90 },
  { mes: 'Jun', promedio: 156, meta: 90 }
];

const HospitalDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedDelegacion, setSelectedDelegacion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const stats = useMemo(() => {
    const totalCirugias = hospitalData.cirugias.length;
    const totalEspera = hospitalData.espera.length;
    const promedioRezago = hospitalData.cirugias.reduce((acc, c) => acc + c.rezago, 0) / totalCirugias;
    const promedioEspera = hospitalData.espera.reduce((acc, e) => acc + e.diasEspera, 0) / totalEspera;
    
    return {
      totalCirugias,
      totalEspera,
      promedioRezago: Math.round(promedioRezago),
      promedioEspera: Math.round(promedioEspera)
    };
  }, []);

  const filteredData = useMemo(() => {
    let filtered = [...hospitalData.cirugias, ...hospitalData.espera];
    
    if (selectedDelegacion !== 'all') {
      filtered = filtered.filter(item => item.delegacion === selectedDelegacion);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.paciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedDelegacion, searchTerm]);

  const StatCard = ({ title, value, icon: Icon, trend, bgColor = "bg-blue-500" }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  const Chip = ({ children, color = "blue", size = "sm" }) => {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
      purple: "bg-purple-100 text-purple-800"
    };
    
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1 text-sm"
    };
    
    return (
      <span className={`inline-flex items-center font-medium rounded-full ${colorClasses[color]} ${sizeClasses[size]}`}>
        {children}
      </span>
    );
  };

  const Avatar = ({ name, size = "sm" }) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base"
    };
    
    return (
      <div className={`${sizeClasses[size]} bg-blue-500 rounded-full flex items-center justify-center text-white font-medium`}>
        {name.charAt(0)}
      </div>
    );
  };

  const Progress = ({ value, max = 100, color = "blue", label }) => (
    <div className="w-full">
      {label && <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-${color}-500 transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  const Button = ({ children, variant = "primary", size = "md", onClick, disabled = false }) => {
    const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
    };
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm"
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );
  };

  const Tab = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
        isActive 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );

  const renderTable = (data, columns) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Hospitalario
              </h1>
              <p className="text-gray-600">
                Sistema de Gestión de Cirugías y Lista de Espera
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Dropdown Delegación */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-48 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>{selectedDelegacion === 'all' ? 'Todas las Delegaciones' : selectedDelegacion}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <button
                      onClick={() => { setSelectedDelegacion('all'); setIsDropdownOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Todas las Delegaciones
                    </button>
                    <button
                      onClick={() => { setSelectedDelegacion('CHIAPAS'); setIsDropdownOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Chiapas
                    </button>
                    <button
                      onClick={() => { setSelectedDelegacion('AGUASCALIENTES'); setIsDropdownOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Aguascalientes
                    </button>
                  </div>
                )}
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar paciente o hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Cirugías"
            value={stats.totalCirugias}
            icon={Activity}
            trend="+12% vs mes anterior"
            bgColor="bg-blue-500"
          />
          <StatCard
            title="En Lista de Espera"
            value={stats.totalEspera}
            icon={Clock}
            trend="-8% vs mes anterior"
            bgColor="bg-orange-500"
          />
          <StatCard
            title="Promedio Rezago"
            value={`${stats.promedioRezago} días`}
            icon={AlertTriangle}
            trend="+5% vs mes anterior"
            bgColor="bg-red-500"
          />
          <StatCard
            title="Promedio Espera"
            value={`${stats.promedioEspera} días`}
            icon={Calendar}
            trend="-15% vs mes anterior"
            bgColor="bg-green-500"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <Tab 
              isActive={selectedTab === 'overview'} 
              onClick={() => setSelectedTab('overview')}
            >
              Resumen General
            </Tab>
            <Tab 
              isActive={selectedTab === 'surgeries'} 
              onClick={() => setSelectedTab('surgeries')}
            >
              Cirugías Realizadas
            </Tab>
            <Tab 
              isActive={selectedTab === 'waiting'} 
              onClick={() => setSelectedTab('waiting')}
            >
              Lista de Espera
            </Tab>
          </nav>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Distribución por Especialidad */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Distribución por Especialidad</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={especialidadesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {especialidadesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {especialidadesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tendencia de Rezago */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Tendencia de Rezago vs Meta</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tendenciaRezago}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="promedio"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      name="Promedio Real"
                    />
                    <Line
                      type="monotone"
                      dataKey="meta"
                      stroke="#10b981"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Meta"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alertas y Notificaciones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="font-medium text-red-800">Casos Críticos</p>
                    <p className="text-sm text-red-600">3 casos con +500 días de espera</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="font-medium text-yellow-800">Atención Requerida</p>
                    <p className="text-sm text-yellow-600">12 casos cerca del límite</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">Mejora Detectada</p>
                    <p className="text-sm text-green-600">Reducción del 15% en esperas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'surgeries' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Registro de Cirugías</h3>
            {renderTable(hospitalData.cirugias, [
              {
                header: 'PACIENTE',
                key: 'paciente',
                render: (row) => (
                  <div className="flex items-center">
                    <Avatar name={row.paciente.split(' ')[0]} />
                    <span className="ml-2 font-medium">{row.paciente}</span>
                  </div>
                )
              },
              { header: 'HOSPITAL', key: 'hospital' },
              {
                header: 'ESPECIALIDAD',
                key: 'especialidad',
                render: (row) => (
                  <Chip color={row.especialidad === 'CIRUGÍA GENERAL' ? 'blue' : 'purple'}>
                    {row.especialidad}
                  </Chip>
                )
              },
              { header: 'DIAGNÓSTICO', key: 'diagnostico' },
              {
                header: 'REZAGO',
                key: 'rezago',
                render: (row) => (
                  <Chip color={row.rezago > 200 ? 'red' : row.rezago > 100 ? 'yellow' : 'green'}>
                    {row.rezago} días
                  </Chip>
                )
              },
              {
                header: 'ESTADO',
                render: () => <Chip color="green">Completada</Chip>
              }
            ])}
          </div>
        )}

        {selectedTab === 'waiting' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pacientes en Lista de Espera</h3>
              <div className="w-64">
                <Progress value={35} color="yellow" label="Capacidad utilizada" />
              </div>
            </div>
            {renderTable(hospitalData.espera, [
              {
                header: 'PACIENTE',
                key: 'paciente',
                render: (row) => (
                  <div className="flex items-center">
                    <Avatar name={row.paciente.split(' ')[0]} />
                    <span className="ml-2 font-medium">{row.paciente}</span>
                  </div>
                )
              },
              { header: 'HOSPITAL', key: 'hospital' },
              { header: 'PROCEDIMIENTO', key: 'procedimiento' },
              {
                header: 'DÍAS EN ESPERA',
                key: 'diasEspera',
                render: (row) => (
                  <Chip color={row.diasEspera > 400 ? 'red' : row.diasEspera > 200 ? 'yellow' : 'green'}>
                    {row.diasEspera} días
                  </Chip>
                )
              },
              {
                header: 'PRIORIDAD',
                render: (row) => (
                  <Chip color={row.diasEspera > 400 ? 'red' : 'yellow'}>
                    {row.diasEspera > 400 ? 'Crítica' : 'Alta'}
                  </Chip>
                )
              },
              {
                header: 'ACCIONES',
                render: () => <Button size="sm">Programar</Button>
              }
            ])}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;

// import { title } from "@/components/primitives";

// export default function AboutPage() {
//   return (
//     <div>
//       <h1 className={title()}>About</h1>
//     </div>
//   );
// }
