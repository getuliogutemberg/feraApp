import React, { useState } from 'react';
import './AdminDatabase.css';

type DbType = 'sequelize' | 'mongoose';

type Params = {
  sequelize: { host: string; port: string; database: string; username: string; password: string };
  mongoose: { uri: string };
};

const dbTypes = [
  { label: 'Sequelize (Postgres/MySQL)', value: 'sequelize' },
  { label: 'Mongoose (MongoDB)', value: 'mongoose' },
];

const initialParams: Params = {
  sequelize: { host: '', port: '', database: '', username: '', password: '' },
  mongoose: { uri: '' },
};

const AdminDatabase = () => {
  const [dbType, setDbType] = useState<DbType>('sequelize');
  const [params, setParams] = useState<Params[DbType]>(initialParams['sequelize']);
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value } as Params[DbType]);
  };

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    setTables([]);
    try {
      const res = await fetch('http://localhost:5000/api/admin/database/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: dbType, params }),
      });
      const data = await res.json();
      // console.log(data)
      if (!res.ok || !data.success) {
        setError(data.error || 'Erro ao conectar ao banco de dados.');
        setTables([]);
      } else {
        setTables(data.tables || []);
      }
    } catch {
      setError('Erro de rede ou servidor.');
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os campos do formulário ao trocar o tipo de banco
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as DbType;
    setDbType(newType);
    setParams(initialParams[newType]);
    setTables([]);
    setError('');
  };

  return (
    <div className="admin-db-container card">
      <h1 className="admin-db-title">Gerenciar Conexão de Dados</h1>
      <form className="admin-db-form">
        <label className="admin-db-label">Tipo de Banco de Dados</label>
        <select
          className="admin-db-select"
          value={dbType}
          onChange={handleTypeChange}
        >
          {dbTypes.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {dbType === 'sequelize' && (
          <>
            <input className="admin-db-input" name="host" placeholder="Host" value={(params as Params['sequelize']).host} onChange={handleParamChange} />
            <input className="admin-db-input" name="port" placeholder="Porta" value={(params as Params['sequelize']).port} onChange={handleParamChange} />
            <input className="admin-db-input" name="database" placeholder="Database" value={(params as Params['sequelize']).database} onChange={handleParamChange} />
            <input className="admin-db-input" name="username" placeholder="Usuário" value={(params as Params['sequelize']).username} onChange={handleParamChange} />
            <input className="admin-db-input" name="password" type="password" placeholder="Senha" value={(params as Params['sequelize']).password} onChange={handleParamChange} />
          </>
        )}
        {dbType === 'mongoose' && (
          <input className="admin-db-input" name="uri" placeholder="MongoDB URI" value={(params as Params['mongoose']).uri} onChange={handleParamChange} />
        )}
        <button type="button" className="admin-db-btn" onClick={handleConnect} disabled={loading}>
          {loading ? 'Conectando...' : 'Testar Conexão'}
        </button>
      </form>
      {error && <div className="admin-db-error">{error}</div>}
      {tables.length > 0 && (
        <div className="admin-db-tables" >
          <h2 className="admin-db-subtitle">Tabelas/Coleções Disponíveis</h2>
          <ul style={{ overflow:'auto', height:"150px"}}>
            {tables.map((t) => <li key={t} className="admin-db-table-item">{t}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDatabase; 