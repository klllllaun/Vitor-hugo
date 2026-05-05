import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Copy, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

/**
 * Design Philosophy: Premium Fintech Investment Platform
 * - Color: Deep blues with emerald accents for trust and growth
 * - Typography: Bold headers with refined body text
 * - Layout: Asymmetric with emphasis on value input and transaction flow
 * - Motion: Smooth transitions and micro-interactions
 */

export default function Home() {
  const [amount, setAmount] = useState(100);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode?: string; pixKey?: string } | null>(null);
  const [showPixSection, setShowPixSection] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 100) {
      setAmount(value);
    } else if (e.target.value === "") {
      setAmount(100);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Código PIX copiado!");
  };

  const handleGeneratePix = async () => {
    if (!fullName.trim()) {
      toast.error("Por favor, insira seu nome completo");
      return;
    }
    if (!email.trim()) {
      toast.error("Por favor, insira seu email");
      return;
    }
    if (!whatsapp.trim()) {
      toast.error("Por favor, insira seu WhatsApp");
      return;
    }
    if (amount < 100) {
      toast.error("O valor mínimo é R$ 100,00");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/gerar-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          fullName,
          whatsapp,
        }),
      });

      const data = await response.json();

      if (data.qrCode) {
        setPixData(data);
        setShowPixSection(true);
        toast.success("PIX gerado com sucesso!");
      } else {
        toast.error("Erro ao gerar PIX. Tente novamente.");
      }
    } catch (error) {
      toast.error("Erro na conexão. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount(100);
    setFullName("");
    setEmail("");
    setWhatsapp("");
    setPixData(null);
    setShowPixSection(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              INVEST
            </h1>
            <p className="text-lg text-blue-200 font-medium">
              Oportunidades Digitais de Retorno
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Amount Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-emerald-600 rounded-full"></div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Valor do Investimento
                  </h2>
                </div>

                <div className="relative mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                    R$
                  </div>
                  <Input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    min="100"
                    step="50"
                    className="pl-16 py-6 text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="100,00"
                  />
                </div>

                {/* Amount Display */}
                <div className="bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mb-2">
                    Valor Total a Transferir
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatCurrency(amount)}
                  </p>
                </div>

                {amount < 100 && (
                  <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                      Valor mínimo: R$ 100,00
                    </p>
                  </div>
                )}
              </div>

              {/* User Data Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-emerald-600 rounded-full"></div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Seus Dados
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                      Nome Completo
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                      WhatsApp
                    </label>
                    <Input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* PIX Section */}
              {showPixSection && pixData && (
                <div className="mb-10 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Dados para Transferência
                    </h2>
                  </div>

                  {pixData?.qrCode && (
                    <div className="mb-6 flex justify-center">
                      <img
                        src={pixData.qrCode}
                        alt="QR Code PIX"
                        className="w-48 h-48 border-2 border-emerald-300 rounded-lg shadow-lg"
                      />
                    </div>
                  )}

                  {pixData?.pixKey && (
                    <div className="mb-6">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                        Código PIX
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1 p-4 bg-white border-2 border-emerald-300 rounded-lg">
                          <p className="font-mono text-sm text-slate-900 break-all">
                            {pixData.pixKey || ""}
                          </p>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(pixData.pixKey || "")}
                          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:shadow-lg transition-all"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                      Como Transferir
                    </p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          1
                        </span>
                        <span>Abra seu aplicativo de banco</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          2
                        </span>
                        <span>Selecione a opção PIX</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          3
                        </span>
                        <span>Cole o código acima ou escaneie o QR Code</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          4
                        </span>
                        <span>Confirme e conclua a transferência</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  onClick={handleGeneratePix}
                  disabled={loading || amount < 100}
                  className="col-span-1 md:col-span-2 py-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:shadow-xl hover:shadow-blue-500/30 text-white font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Gerar PIX
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="py-6 border-2 border-slate-300 text-slate-900 font-bold uppercase tracking-wider hover:bg-slate-50 transition-all"
                >
                  Limpar Formulário
                </Button>
              </div>

              {/* Security Badge */}
              <div className="pt-6 border-t border-slate-200 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <p className="text-xs font-semibold text-slate-700">
                    Transação 100% segura e criptografada
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Footer Info */}
          <div className="mt-12 text-center text-blue-200/60 text-sm font-medium">
            <p>Plataforma segura de investimento digital</p>
          </div>
        </div>
      </div>
    </div>
  );
}
