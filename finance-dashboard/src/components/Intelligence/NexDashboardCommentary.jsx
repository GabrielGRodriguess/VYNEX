import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { nexAgent } from '../../services/agents/nexAgent';
import { nexConversion } from '../../services/agents/nexConversion';
import { whatsappService } from '../../services/whatsappService';
import { abService } from '../../services/abService';
import { analyticsService } from '../../services/analyticsService';
import { useFinance } from '../../context/FinanceContext';
import { useUser } from '../../context/UserContext';
import { MessageSquare, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

export default function NexDashboardCommentary() {
  const { analytics } = useFinance();
  const { user } = useUser();
  
  const variant = useMemo(() => {
    return abService.getVariant(user?.id);
  }, [user?.id]);

  const diagnostic = useMemo(() => {
    return nexAgent.getDiagnostic(analytics);
  }, [analytics]);

  const offer = useMemo(() => {
    return nexConversion.getRecommendedOffer(analytics);
  }, [analytics]);

  // Track View
  useEffect(() => {
    if (user?.id && diagnostic.mood !== 'waiting') {
      analyticsService.trackEvent(
        analyticsService.EVENTS.NEX_CTA_VIEWED, 
        user.id, 
        { mood: diagnostic.mood, offer_id: offer?.id },
        variant
      );
    }
  }, [user?.id, diagnostic.mood, variant, offer?.id]);

  const handleConversion = () => {
    if (offer && user?.id) {
      analyticsService.trackEvent(
        analyticsService.EVENTS.NEX_CTA_CLICKED, 
        user.id, 
        { offer_id: offer.id },
        variant
      );
      whatsappService.openConversation(offer.waIntent, user);
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'elite': return 'text-brand-green border-brand-green/20 bg-brand-green/5';
      case 'balanced': return 'text-blue-400 border-blue-400/20 bg-blue-500/5';
      case 'cautious': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      case 'critical': return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
      default: return 'text-slate-400 border-white/5 bg-white/5';
    }
  };

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass p-6 sm:p-8 border ${getMoodColor(diagnostic.mood)} relative overflow-hidden group`}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
          {/* Nex Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-950/50 flex items-center justify-center border border-white/10 overflow-hidden">
               <Sparkles className={getMoodColor(diagnostic.mood).split(' ')[0]} size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-950 rounded-full flex items-center justify-center border border-white/10">
              <div className={`w-2 h-2 rounded-full animate-pulse ${getMoodColor(diagnostic.mood).split(' ')[0].replace('text-', 'bg-')}`} />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] opacity-60">Nex Intelligence</h4>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{diagnostic.title}</h3>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              "{diagnostic.text}"
            </p>

            <div className="pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Próximo Passo Estratégico</p>
                <p className="text-xs text-slate-400 italic leading-relaxed">{diagnostic.recommendation}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleConversion}
                  className="w-full bg-brand-green text-slate-950 px-5 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {offer?.cta || 'Desbloquear Oferta'} <ExternalLink size={14} />
                </button>
                <p className="text-[9px] text-center text-slate-500 uppercase tracking-widest font-bold">
                  Continua no WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
