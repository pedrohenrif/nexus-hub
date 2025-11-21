import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Lock, Mail, User, KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
        if (mode === 'login') {
            const data = await api.login(email, password);
            
            // Salva o token para persistir a sessão
            localStorage.setItem('nexus_token', data.token);
            
            // Salva os dados do usuário para exibir na Sidebar (nome, role, etc)
            localStorage.setItem('nexus_user', JSON.stringify(data.user)); 
            
            navigate('/projects');
        } 
        else if (mode === 'register') {
            await api.register(name, email, password);
            setSuccessMsg('Solicitação enviada com sucesso! Aguarde a aprovação do administrador.');
            setPassword('');
        } 
        else if (mode === 'forgot') {
            await api.resetPassword(email, password); 
            setSuccessMsg('Nova senha solicitada! Aguarde a aprovação do administrador.');
            setPassword('');
        }
    } catch (error: any) {
        console.error(error);
        setErrorMsg(error.message || 'Ocorreu um erro inesperado.');
    } finally {
        setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
      setMode(newMode);
      setErrorMsg('');
      setSuccessMsg('');
      setPassword(''); 
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      
      {/* Fundo Decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in">
        
        <div className="p-8 w-full">
          <div className="flex justify-center mb-8">
             <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                 <Layers className="text-white" size={32} />
             </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">
            {mode === 'login' && 'Bem-vindo de volta'}
            {mode === 'register' && 'Solicitar Acesso'}
            {mode === 'forgot' && 'Recuperar Senha'}
          </h2>
          <p className="text-center text-slate-400 text-sm mb-6">
            {mode === 'login' && 'Faça login para gerenciar seus projetos.'}
            {mode === 'register' && 'Preencha os dados para solicitar uma conta.'}
            {mode === 'forgot' && 'Defina uma nova senha para aprovação.'}
          </p>

          {/* MENSAGENS DE FEEDBACK */}
          {errorMsg && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 text-sm text-red-800 animate-pulse">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0"/>
                  <span>{errorMsg}</span>
              </div>
          )}

          {successMsg ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in">
                  <CheckCircle className="mx-auto text-green-500 mb-3" size={40}/>
                  <h3 className="text-green-800 font-bold mb-1">Sucesso!</h3>
                  <p className="text-green-700 text-sm mb-4">{successMsg}</p>
                  <button 
                    onClick={() => switchMode('login')} 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-full"
                  >
                    Voltar ao Login
                  </button>
              </div>
          ) : (
              <form onSubmit={handleAction} className="space-y-4">
                
                {mode === 'register' && (
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Seu Nome" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" 
                            required 
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                )}

                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                        type="email" 
                        placeholder="Seu Email" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" 
                        required 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="relative group">
                    {mode === 'forgot' ? (
                         <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    ) : (
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    )}
                    <input 
                        type="password" 
                        placeholder={mode === 'forgot' ? "Nova Senha Desejada" : "Sua Senha"} 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" 
                        required 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processando...' : (
                        <>
                            {mode === 'login' && 'Entrar'}
                            {mode === 'register' && 'Enviar Solicitação'}
                            {mode === 'forgot' && 'Solicitar Troca'}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
              </form>
          )}

          <div className="mt-6 flex flex-col gap-3 text-center text-sm">
             {mode === 'login' && !successMsg && (
                 <>
                    <button onClick={() => switchMode('forgot')} className="text-slate-500 hover:text-indigo-600 transition-colors">Esqueceu sua senha?</button>
                    <div className="text-slate-400">Não tem conta? <button onClick={() => switchMode('register')} className="text-indigo-600 font-bold hover:underline">Solicitar Acesso</button></div>
                 </>
             )}
             {(mode === 'register' || mode === 'forgot') && !successMsg && (
                 <button onClick={() => switchMode('login')} className="text-slate-500 hover:text-indigo-600 transition-colors">Voltar para Login</button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}