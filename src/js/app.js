document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
  
      loading: true,
      scrolled: false,
      dark: false,
      fs: 1,
      view: 'pub',
      adminTab: 'dash',
      openSrv: null,
  
      modals: { sched: false, login: false },
      srvModal: { open: false, srv: null },
      lb: { open: false, idx: 0, img: '' },
      loginD: { user: '', pass: '' },
      sched: { serviceId: '', proId: '', name: '' },
  
      nSrv: { name: '', icon: '', desc: '' },
      nPro: { name: '', registry: '', serviceId: '' },
      nConv: '',
      toasts: [],
  
      cfg: {
        phone: '(21) 2040-1842',
        whatsappRaw: '552120401842',
        email: 'falecom@clinicamultievoluir.com.br',
        address: 'R. Maj. Carvalho, 65 - Várzea, Teresópolis - RJ, 25953-460',
        hours: 'Seg a Sex: 08h às 19h',
        hoursWeek: '08h às 19h',
        hoursSat: 'Fechado',
        instagram: 'https://instagram.com/clinicamultievoluir',
        logo: './assets/logo-evoluir.png',
      },
  
      db: {
        services: [
          { id:'fisio',     name:'Fisioterapia',              icon:'fa-person-walking',        desc:'Reabilitação e prevenção de lesões físicas.' },
          { id:'psico',     name:'Psicologia',                icon:'fa-brain',                  desc:'Saúde mental, autoconhecimento e bem-estar emocional.' },
          { id:'fono',      name:'Fonoaudiologia',            icon:'fa-ear-listen',             desc:'Comunicação, linguagem e deglutição.' },
          { id:'nutri',     name:'Nutrição',                  icon:'fa-apple-whole',            desc:'Alimentação equilibrada para cada fase da vida.' },
          { id:'to',        name:'Terapia Ocupacional',       icon:'fa-hands-holding',          desc:'Desenvolvimento e independência nas atividades diárias.' },
          { id:'music',     name:'Musicoterapia',             icon:'fa-music',                  desc:'Música como ferramenta terapêutica e sensorial.' },
          { id:'arte',      name:'Arteterapia',               icon:'fa-palette',                desc:'Arte como caminho para a expressão e o equilíbrio.' },
          { id:'pilates',   name:'Pilates',                   icon:'fa-spa',                    desc:'Fortalecimento, postura e qualidade de vida.' },
          { id:'psicoped',  name:'Psicopedagogia',            icon:'fa-graduation-cap',         desc:'Aprendizagem, leitura e desenvolvimento escolar.' },
          { id:'psicomot',  name:'Psicomotricidade',          icon:'fa-hands-holding-child',    desc:'Desenvolvimento motor e cognição em crianças.' },
          { id:'tf',        name:'Treinamento Funcional',     icon:'fa-dumbbell',               desc:'Condicionamento físico supervisionado.' },
          { id:'tfkids',    name:'Treinamento Funcional Kids',icon:'fa-child-reaching',         desc:'Movimento saudável e divertido para crianças.' },
        ],
        professionals: [
          { id:1, name:'Dra. Ana Costa',      registry:'CREFITO 1234', serviceId:'fisio',   color:'#5a8a96' },
          { id:2, name:'Dr. João Silva',      registry:'CRP 5678',     serviceId:'psico',   color:'#7c6fa0' },
          { id:3, name:'Dra. Maria Fernanda', registry:'CRN 9101',     serviceId:'nutri',   color:'#6aab7a' },
          { id:4, name:'Dr. Carlos Mendes',   registry:'CRFA 1121',    serviceId:'fono',    color:'#c77a5a' },
          { id:5, name:'Dra. Luisa Ramos',    registry:'TO 3344',      serviceId:'to',      color:'#b08050' },
          { id:6, name:'Ms. Paula Torres',    registry:'CONFEF 7890',  serviceId:'pilates', color:'#4a8a7a' },
        ],
        convenios: ['Unimed','Amil','Bradesco Saúde','SulAmérica','Golden Cross','Particular'],
        gallery: ['./assets/recepcao.jpg','./assets/infantil.jpg','./assets/pilates.webp','./assets/atendimento.jpg','./assets/fachada-clinica.png'],
      },
  
      adminTabs: {
        dash: { label:'Visão Geral',    icon:'fa-chart-pie' },
        cfg:  { label:'Configurações',  icon:'fa-sliders' },
        srv:  { label:'Especialidades', icon:'fa-stethoscope' },
        pro:  { label:'Equipe',         icon:'fa-user-doctor' },
        conv: { label:'Convênios',      icon:'fa-handshake' },
      },
  
      init() {
        this.dark = localStorage.getItem('ev3_theme') === 'dark';
        this.fs = parseFloat(localStorage.getItem('ev3_fs')) || 1;
        try {
          const s = localStorage.getItem('ev3_data');
          if (s) {
            const p = JSON.parse(s);
            this.cfg = { ...this.cfg, ...(p.cfg||{}) };
            this.db  = { ...this.db,  ...(p.db ||{}) };
          }
        } catch(e){}
  
        window.addEventListener('scroll', () => { this.scrolled = window.scrollY > 24; });
  
        // Cursor personalizado
        const cur = document.getElementById('cur');
        if (cur) {
          document.addEventListener('mousemove', e => {
            cur.style.left = e.clientX + 'px';
            cur.style.top  = e.clientY + 'px';
          });
          document.querySelectorAll('a,button,[role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => cur.classList.add('big'));
            el.addEventListener('mouseleave', () => cur.classList.remove('big'));
          });
        }
  
        setTimeout(() => {
          this.loading = false;
          this.$nextTick(() => this.initReveal());
        }, 800);
      },
  
      initReveal() {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }});
        }, { threshold: 0.08 });
        document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el => obs.observe(el));
      },
  
      toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('ev3_theme', this.dark ? 'dark' : 'light');
        this.toast(this.dark ? 'Modo escuro' : 'Modo claro', 'info');
      },
      cycleFs() {
        this.fs = this.fs >= 1.25 ? 1 : this.fs + 0.125;
        localStorage.setItem('ev3_fs', this.fs);
        this.toast(`Fonte ${Math.round(this.fs*100)}%`, 'info');
      },
      save() {
        try { localStorage.setItem('ev3_data', JSON.stringify({ cfg: this.cfg, db: this.db })); } catch(e){}
      },
      toast(msg, type='ok') {
        const id = Date.now();
        this.toasts.push({ id, msg, type });
        setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 3000);
      },
  
      // Modals
      om(type, extra=null) {
        this.modals[type] = true;
        if (type === 'sched') this.sched = { serviceId: extra||'', proId:'', name:'' };
      },
      cm() { this.modals.sched = false; this.modals.login = false; this.loginD = { user:'', pass:'' }; },
  
      // Lightbox
      openLb(i) { this.lb = { open:true, idx:i, img:this.db.gallery[i] }; },
      lbPrev() {
        const n = this.db.gallery.length;
        this.lb.idx = (this.lb.idx - 1 + n) % n;
        this.lb.img = this.db.gallery[this.lb.idx];
      },
      lbNext() {
        const n = this.db.gallery.length;
        this.lb.idx = (this.lb.idx + 1) % n;
        this.lb.img = this.db.gallery[this.lb.idx];
      },
  
      // Specialty accordion (não usado mais, mantido por segurança)
      toggleSrv(id) { this.openSrv = this.openSrv === id ? null : id; },
      // Modal de especialidade
      openSrvModal(id) {
        this.srvModal.srv = this.db.services.find(s => s.id === id) || null;
        this.srvModal.open = true;
      },
  
      // Helpers
      srvName(id) { const s = this.db.services.find(s=>s.id===id); return s?s.name:'Especialista'; },
      getProsForSrv(id) { return id ? this.db.professionals.filter(p=>p.serviceId===id) : []; },
  
      // WhatsApp
      sendWA() {
        if (!this.sched.serviceId || !this.sched.name.trim()) {
          this.toast('Preencha a especialidade e seu nome.', 'err'); return;
        }
        const nome = this.sched.name.trim();
        const srv = this.srvName(this.sched.serviceId);
        let txt = `Olá, Clínica Evoluir! Sou *${nome}* e gostaria de agendar para *${srv}*.`;
        if (this.sched.proId) txt += ` Prefiro ser atendido(a) por *${this.sched.proId}*.`;
        window.open(`https://wa.me/${this.cfg.whatsappRaw}?text=${encodeURIComponent(txt)}`, '_blank');
        this.cm();
      },
  
      // Login
      doLogin() {
        if (this.loginD.user==='admin' && this.loginD.pass==='admin') {
          this.cm(); this.view='adm'; this.toast('Bem-vindo ao painel!');
          this.$nextTick(() => {
            // Adiciona classe para offset sidebar desktop
            document.querySelector('.adm-with-sidebar')?.remove();
          });
        } else {
          this.toast('Credenciais inválidas. Use: admin / admin', 'err');
        }
      },
      logout() { this.view='pub'; this.adminTab='dash'; this.toast('Sessão encerrada', 'info'); this.$nextTick(()=>this.initReveal()); },
  
      // Config
      saveConfig() {
        this.cfg.whatsappRaw = this.cfg.phone.replace(/\D/g,'');
        this.cfg.hours = `Seg a Sex: ${this.cfg.hoursWeek||'Fechado'}` +
          (this.cfg.hoursSat && this.cfg.hoursSat.toLowerCase()!=='fechado' ? ` | Sáb: ${this.cfg.hoursSat}` : '');
        this.save(); this.toast('Configurações salvas!');
      },
      handleLogo(e) {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => { this.cfg.logo = r.result; this.save(); this.toast('Logo atualizada'); };
        r.readAsDataURL(f);
      },
      handleGallery(e) {
        const f = e.target.files?.[0]; if (!f || this.db.gallery.length>=7) return;
        const r = new FileReader();
        r.onload = () => { this.db.gallery.push(r.result); this.save(); this.toast('Foto adicionada'); };
        r.readAsDataURL(f); e.target.value='';
      },
      rmGallery(i) { this.db.gallery.splice(i,1); this.save(); this.toast('Foto removida'); },
  
      // Serviços
      addSrv() {
        if (!this.nSrv.name) return;
        const id = this.nSrv.name.toLowerCase().replace(/\s/g,'').substring(0,8)+Date.now().toString().slice(-4);
        this.db.services.push({ id, name:this.nSrv.name, icon:this.nSrv.icon||'fa-stethoscope', desc:this.nSrv.desc });
        this.nSrv={name:'',icon:'',desc:''}; this.save(); this.toast('Especialidade cadastrada');
      },
      rmSrv(id) { this.db.services=this.db.services.filter(s=>s.id!==id); this.save(); this.toast('Removida'); },
  
      // Profissionais
      addPro() {
        if (!this.nPro.name||!this.nPro.serviceId) return;
        const clr=['#5a8a96','#7c6fa0','#6aab7a','#c77a5a','#b08050','#4a8a7a','#a0607a'];
        this.db.professionals.push({ id:Date.now(), name:this.nPro.name, registry:this.nPro.registry, serviceId:this.nPro.serviceId, color:clr[this.db.professionals.length%clr.length] });
        this.nPro={name:'',registry:'',serviceId:''}; this.save(); this.toast('Profissional cadastrado');
      },
      rmPro(id) { this.db.professionals=this.db.professionals.filter(p=>p.id!==id); this.save(); this.toast('Removido'); },
  
      // Convênios
      addConv() {
        if (!this.nConv.trim()) return;
        this.db.convenios.push(this.nConv.trim()); this.nConv=''; this.save(); this.toast('Convênio adicionado');
      },
      rmConv(i) { this.db.convenios.splice(i,1); this.save(); this.toast('Removido'); },
  
    }));
  });