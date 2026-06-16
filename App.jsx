<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Nexus | Ecossistema de Alta Performance</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    
    <!-- Three.js Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <style>
        :root {
            --bg-color: #050508;
            --assistant-bg: rgba(18, 18, 30, 0.92);
            --user-bg: rgba(35, 35, 60, 0.85);
            --accent-cyan: #00D4FF;
            --text-main: #FFFFFF;
            --text-dim: #B0B0B0;
            --gradient-primary: linear-gradient(90deg, #00C6FF, #0072FF);
            
            --metallic-silver: linear-gradient(
                135deg, 
                #f0f0f0 0%, 
                #808080 20%, 
                #e0e0e0 40%, 
                #ffffff 50%, 
                #a0a0a0 60%, 
                #dcdcdc 80%, 
                #f0f0f0 100%
            );
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.7;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100vh;
            position: relative;
        }

        #galaxy-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: #000;
        }

        header {
            padding: 25px 15px;
            text-align: center;
            background: rgba(5, 5, 8, 0.75);
            backdrop-filter: blur(20px);
            z-index: 100;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            flex-shrink: 0;
        }

        header h1 {
            font-weight: 800;
            font-size: 1.6rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            background: var(--metallic-silver);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.6));
            animation: silver-shine 6s linear infinite;
            line-height: 1.2;
            display: inline-block;
        }

        @keyframes silver-shine {
            to { background-position: 200% center; }
        }

        header p {
            font-size: 0.7rem;
            color: var(--text-dim);
            margin-top: 6px;
            letter-spacing: 3px;
            text-transform: uppercase;
            opacity: 0.8;
        }

        /* Barra de progresso */
        #progress-container {
            max-width: 850px;
            margin: 0 auto;
            padding: 0 20px 10px;
            z-index: 99;
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transform: translateY(-5px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        #progress-container.visible {
            opacity: 1;
            transform: translateY(0);
        }

        #progress-label {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--text-dim);
            white-space: nowrap;
        }

        #progress-text {
            color: var(--accent-cyan);
            font-weight: 600;
        }

        #progress-bar {
            flex: 1;
            height: 3px;
            background: rgba(255,255,255,0.08);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }

        #progress-fill {
            height: 100%;
            width: 0%;
            background: var(--gradient-primary);
            border-radius: 10px;
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
            position: relative;
        }

        #progress-fill::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(0, 212, 255, 0.9);
            opacity: 0.9;
        }

        #chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 30px 20px;
            max-width: 850px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 24px;
            z-index: 10;
            scrollbar-width: none;
            padding-bottom: 160px; 
        }

        #chat-container::-webkit-scrollbar { display: none; }

        .message {
            max-width: 85%;
            padding: 20px 24px;
            font-size: 0.95rem;
            animation: fadeIn 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            word-wrap: break-word;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.12);
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            position: relative;
            line-height: 1.6;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .assistant {
            align-self: flex-start;
            background-color: var(--assistant-bg);
            border-radius: 4px 24px 24px 24px;
            border-left: 4px solid rgba(255,255,255,0.4);
            color: #f0f0f0;
        }

        .user {
            align-self: flex-end;
            background-color: var(--user-bg);
            border-radius: 24px 24px 4px 24px;
            border-right: 4px solid var(--accent-cyan);
            color: #fff;
            text-align: right;
        }

        /* Botões de opção dentro do chat */
        .options-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
            animation: fadeIn 0.35s ease 0.15s both;
            align-self: flex-start;
            width: 100%;
            max-width: 85%;
        }

        .option-btn {
            background: rgba(20, 22, 38, 0.75);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 16px;
            padding: 14px 18px;
            color: #ffffff;
            font-size: 0.9rem;
            font-weight: 500;
            text-align: left;
            cursor: pointer;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .option-btn:active {
            transform: scale(0.97);
            background: rgba(0, 212, 255, 0.15);
            border-color: rgba(0, 212, 255, 0.5);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .option-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            background: var(--gradient-primary);
            color: #fff;
            border-radius: 50%;
            font-weight: 700;
            font-size: 0.8rem;
            flex-shrink: 0;
        }

        /* Área de input */
        .input-area {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(to top, var(--bg-color) 80%, transparent);
            padding: 20px 20px 45px 20px;
            z-index: 100;
        }

        .input-wrapper {
            max-width: 700px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(20, 20, 35, 0.98);
            padding: 10px 10px 10px 26px;
            border-radius: 50px;
            border: 1px solid rgba(255,255,255,0.25);
            box-shadow: 0 15px 50px rgba(0,0,0,0.7);
            backdrop-filter: blur(30px);
        }

        input {
            flex: 1;
            background: transparent;
            border: none;
            color: white;
            padding: 12px 0;
            font-size: 1.1rem;
            outline: none;
            min-width: 0;
        }

        input::placeholder {
            color: rgba(255,255,255,0.35);
        }

        button#send-btn {
            background: var(--metallic-silver);
            border: none;
            color: #000;
            height: 52px;
            padding: 0 32px;
            border-radius: 40px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 1.5px;
            flex-shrink: 0;
        }
        
        button#send-btn:active {
            transform: scale(0.94);
            filter: brightness(0.9);
        }

        /* CTA FINAL */
        #final-cta {
            background: rgba(10, 10, 20, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 30px;
            padding: 45px 30px;
            margin-top: 20px;
            margin-bottom: 20px;
            text-align: center;
            display: none;
            backdrop-filter: blur(30px);
            box-shadow: 0 25px 70px rgba(0,0,0,0.9);
            width: 100%;
            max-width: 100%;
            animation: fadeIn 0.8s ease-out forwards;
            align-self: center;
        }

        .cta-title { 
            font-weight: 800; 
            font-size: 1.6rem; 
            margin-bottom: 12px;
            background: var(--metallic-silver);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: silver-shine 6s linear infinite;
        }

        .benefits { text-align: left; margin: 25px 0; font-size: 0.95rem; list-style: none; display: inline-block; }
        .benefits li { margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }

        .nexus-btn {
            display: block;
            width: 100%;
            padding: 22px;
            background: var(--gradient-primary);
            color: white;
            text-decoration: none;
            border-radius: 16px;
            font-weight: 800;
            font-size: 1.1rem;
            text-transform: uppercase;
            box-shadow: 0 12px 45px rgba(0, 198, 255, 0.45);
            transition: all 0.4s;
            cursor: pointer;
            border: none;
        }

        .nexus-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .nexus-btn:active { transform: translateY(0); }

        /* MOBILE OPTIMIZATION */
        @media (max-width: 600px) {
            header h1 { font-size: 1.3rem; }
            #chat-container { 
                padding: 30px 18px 200px 18px; 
                gap: 20px; 
            }
            .message { 
                max-width: 90%;
                font-size: 0.9rem; 
                padding: 16px 20px;
            }
            .assistant { border-left-width: 3px; }
            .user { border-right-width: 3px; }
            
            button#send-btn { padding: 0 20px; font-size: 0.75rem; height: 48px; }
            .input-area { padding: 15px 15px 30px 15px; }
            .input-wrapper { padding-left: 20px; }

            .option-btn {
                padding: 12px 14px;
                font-size: 0.8rem;
            }

            #final-cta {
                padding: 35px 20px;
                margin-top: 10px;
            }

            #progress-container {
                padding: 0 18px 8px;
                gap: 8px;
            }
            #progress-label {
                font-size: 0.65rem;
            }
        }

        @media (max-width: 400px) {
            #chat-container { padding: 20px 12px 180px 12px; }
            .input-area { padding: 10px 10px 25px 10px; }
            .input-wrapper { padding-left: 16px; gap: 8px; }
            button#send-btn { padding: 0 16px; font-size: 0.7rem; height: 44px; }
            input { font-size: 0.95rem; }
        }
    </style>
</head>
<body>

    <canvas id="galaxy-bg"></canvas>

    <header>
        <h1>Ecossistema Nexus</h1>
        <p>Inteligência • Estrutura • Performance</p>
    </header>

    <!-- Barra de progresso do diagnóstico -->
    <div id="progress-container">
        <div id="progress-label">Diagnóstico • <span id="progress-text">0/7</span></div>
        <div id="progress-bar">
            <div id="progress-fill"></div>
        </div>
    </div>

    <main id="chat-container">
        <!-- Mensagens serão inseridas aqui via JS -->
        <!-- CTA final posicionado no final do container -->
        <div id="final-cta">
            <div class="cta-title">ACESSO LIBERADO 🔓</div>
            <p style="color: #bbb; font-size: 0.95rem;">Seu novo sistema operacional de inteligência.</p>
            <ul class="benefits">
                <li><span>✅</span> <strong>I.A.s de Elite</strong> pré-configuradas</li>
                <li><span>✅</span> <strong>Metodologia</strong> de Engenharia de Contexto</li>
                <li><span>✅</span> <strong>Workspaces</strong> prontos para uso</li>
            </ul>
            <button class="nexus-btn" id="final-cta-btn">COMEÇAR AGORA 🚀</button>
        </div>
    </main>

    <div class="input-area" id="input-container">
        <div class="input-wrapper">
            <input type="text" id="user-input" placeholder="Digite sua resposta..." autocomplete="off">
            <button id="send-btn">ENVIAR</button>
        </div>
    </div>

    <script>
        // --- THREE.JS GALAXY ENGINE (cores realistas da Via Láctea) ---
        const canvas = document.getElementById('galaxy-bg');
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 4.5;
        camera.position.y = 1.0;
        camera.rotation.x = -0.25;

        const parameters = {
            count: 35000,
            size: 0.008,
            radius: 5,
            branches: 3,
            spin: 1.2,
            randomness: 0.4,
            randomnessPower: 3,
            // Cores da galáxia real: núcleo amarelado/quente, braços azulados
            insideColor: '#ffe6b3',  // tom amarelo-alaranjado claro (região central)
            outsideColor: '#4d7eb3'   // azul suave (braços espirais)
        };

        let geometry, material, points;

        const generateGalaxy = () => {
            if (points) scene.remove(points);
            geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(parameters.count * 3);
            const colors = new Float32Array(parameters.count * 3);
            const colorInside = new THREE.Color(parameters.insideColor);
            const colorOutside = new THREE.Color(parameters.outsideColor);

            for(let i = 0; i < parameters.count; i++) {
                const i3 = i * 3;
                const radius = Math.random() * parameters.radius;
                const spinAngle = radius * parameters.spin;
                const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

                const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
                const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
                const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

                positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
                positions[i3 + 1] = randomY * 0.4;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

                const mixedColor = colorInside.clone();
                mixedColor.lerp(colorOutside, radius / parameters.radius);
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            material = new THREE.PointsMaterial({
                size: parameters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            });

            points = new THREE.Points(geometry, material);
            scene.add(points);
        };

        generateGalaxy();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            if (points) points.rotation.y = elapsedTime * 0.05;
            renderer.render(scene, camera);
            window.requestAnimationFrame(animate);
        };
        animate();

        // --- CHAT LOGIC (Diagnóstico Híbrido) ---
        const chatContainer = document.getElementById('chat-container');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const finalCta = document.getElementById('final-cta');
        const finalCtaBtn = document.getElementById('final-cta-btn');
        const inputContainer = document.getElementById('input-container');

        // Elementos da barra de progresso
        const progressContainer = document.getElementById('progress-container');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const totalQuestions = 7; // steps 1 a 7

        let step = 0;
        let userName = '';
        let awaitingOption = false;
        let optionResolver = null;

        const profile = {
            perfil: null,
            ia: null,
            habilidade: null,
            informacao: null,
            obstaculo: null,
            aprendizado: null,
            forca: null
        };

        function updateProgress(currentStep) {
            const answered = Math.min(currentStep, totalQuestions);
            const percent = (answered / totalQuestions) * 100;
            
            if (currentStep >= 1 && !progressContainer.classList.contains('visible')) {
                progressContainer.classList.add('visible');
            }
            
            progressFill.style.width = percent + '%';
            progressText.textContent = answered + '/' + totalQuestions;
        }

        function scrollToBottom() {
            requestAnimationFrame(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
        }

        function addMessage(text, role) {
            return new Promise(resolve => {
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', role);
                msgDiv.innerHTML = text;
                
                chatContainer.insertBefore(msgDiv, finalCta);
                scrollToBottom();
                
                const charCount = text.replace(/<[^>]*>/g, '').length;
                const readingTime = Math.min(Math.max(charCount * 60, 1200), 4000);
                setTimeout(resolve, readingTime);
            });
        }

        function removeOptions() {
            const existing = document.querySelector('.options-container');
            if (existing) existing.remove();
        }

        function showOptions(options) {
            removeOptions();
            const container = document.createElement('div');
            container.className = 'options-container';
            options.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<span class="option-number">${index+1}</span> ${opt}`;
                btn.addEventListener('click', () => {
                    if (!awaitingOption) return;
                    removeOptions();
                    awaitingOption = false;
                    if (optionResolver) {
                        optionResolver({ index, text: opt });
                        optionResolver = null;
                    }
                });
                container.appendChild(btn);
            });
            chatContainer.insertBefore(container, finalCta);
            scrollToBottom();
        }

        function waitForOption(options) {
            return new Promise(resolve => {
                awaitingOption = true;
                optionResolver = resolve;
                showOptions(options);
            });
        }

        function gerarDiagnostico(p) {
            let tipo = '';
            let pontosFortes = [];
            let pontosAtencao = [];
            let recomendacao = '';
            let iaInsight = '';

            if (p.perfil === 0 && p.obstaculo === 0) {
                tipo = 'Criativo Bloqueado';
                pontosFortes.push('Grande capacidade de ideação e criatividade');
                pontosFortes.push('Visão ampla e pensamento divergente');
                pontosAtencao.push('Dificuldade em transformar ideias em ações concretas');
                pontosAtencao.push('Tendência a se dispersar com múltiplas possibilidades');
                recomendacao = 'Você precisa de um sistema que canalize sua criatividade para execução, com priorização clara e marcos de entrega.';
                iaInsight = 'A IA pode ser sua parceira para estruturar ideias e criar planos de ação detalhados, vencendo o bloqueio criativo.';
            } else if (p.perfil === 1 && p.informacao <= 1) {
                tipo = 'Estudante Sobrecarregado';
                pontosFortes.push('Dedicação aos estudos e busca por conhecimento');
                pontosFortes.push('Capacidade de absorver grande volume de informações');
                pontosAtencao.push('Baixa retenção e aplicação prática do que aprende');
                pontosAtencao.push('Sobrecarga informacional gerando paralisia');
                recomendacao = 'Seu desafio não é aprender mais, mas sim organizar e aplicar o conhecimento. Um método de síntese e revisão é essencial.';
                iaInsight = 'Use a IA como curadora: ela resume, organiza e destaca o essencial para você, reduzindo a sobrecarga.';
            } else if (p.perfil === 2 && p.ia >= 2) {
                tipo = 'Executante Disperso';
                pontosFortes.push('Disposição para agir e realizar tarefas');
                pontosFortes.push('Familiaridade com ferramentas de IA');
                pontosAtencao.push('Perda de tempo com atividades repetitivas que poderiam ser automatizadas');
                pontosAtencao.push('Falta de um fluxo de trabalho otimizado');
                recomendacao = 'Você já usa tecnologia, mas ainda não extrai o máximo dela. Automatize processos e libere tempo para o estratégico.';
                iaInsight = 'A IA já é sua aliada; agora dê um salto: delegue tarefas operacionais e foque na estratégia.';
            } else if (p.habilidade === 0 && p.aprendizado === 1) {
                tipo = 'Aprendiz Visual';
                pontosFortes.push('Alta motivação para aprender');
                pontosFortes.push('Preferência por formatos visuais e interativos');
                pontosAtencao.push('Pode se frustrar com métodos tradicionais de estudo');
                pontosAtencao.push('Necessidade de estímulos variados para manter o foco');
                recomendacao = 'Combine mapas mentais, vídeos e prática ativa. O Nexus Manual oferece exatamente essa abordagem multimodal.';
                iaInsight = 'A IA pode criar resumos visuais, infográficos e até quizzes para reforçar seu aprendizado.';
            } else if (p.forca === 0 && p.obstaculo === 2) {
                tipo = 'Estrategista com Propósito';
                pontosFortes.push('Resiliência e determinação notáveis');
                pontosFortes.push('Capacidade de superar adversidades');
                pontosAtencao.push('Falta de clareza nos objetivos de longo prazo');
                pontosAtencao.push('Risco de se esforçar muito na direção errada');
                recomendacao = 'Defina metas claras e mensuráveis. Sua força precisa de um alvo bem definido para gerar resultados extraordinários.';
                iaInsight = 'Com a IA, você pode simular cenários e validar decisões rapidamente, ganhando clareza de direção.';
            } else if (p.ia === 0 && p.informacao === 0) {
                tipo = 'Explorador Iniciante';
                pontosFortes.push('Mente fresca e sem vícios tecnológicos');
                pontosFortes.push('Potencial para adotar as melhores práticas desde o início');
                pontosAtencao.push('Desconexão com as ferramentas atuais de produtividade');
                pontosAtencao.push('Sobrecarga informacional sem filtros');
                recomendacao = 'Comece com o básico: um sistema de gestão de informações e introdução gradual à IA como assistente pessoal.';
                iaInsight = 'A IA pode ser sua porta de entrada para um novo mundo de produtividade, sem os vícios de quem já usa de forma errada.';
            } else if (p.ia === 3 && p.informacao >= 2) {
                tipo = 'Tecnologista Avançado';
                pontosFortes.push('Uso intensivo de IA e tecnologia');
                pontosFortes.push('Alta exposição a informações relevantes');
                pontosAtencao.push('Risco de dependência tecnológica sem critério próprio');
                pontosAtencao.push('Pode estar consumindo mais do que produzindo');
                recomendacao = 'Você está na fronteira. Agora precisa de um sistema de curadoria e execução que vá além da IA, integrando sua intuição e decisão estratégica.';
                iaInsight = 'A IA é seu copiloto, mas quem precisa estar no controle é você. Use-a como alavanca, não como bengala.';
            } else if (p.aprendizado === 2 || p.aprendizado === 3) {
                tipo = 'Prático Experimentador';
                pontosFortes.push('Aprendizado focado na prática e na experiência direta');
                pontosFortes.push('Capacidade de aprender fazendo');
                pontosAtencao.push('Pode pular etapas importantes de fundamentação');
                pontosAtencao.push('Necessidade de equilibrar teoria e prática');
                recomendacao = 'Alterne entre ciclos de estudo e aplicação imediata. O método "aprender-praticar-ensinar" será seu maior aliado.';
                iaInsight = 'A IA pode gerar protótipos e simulações para você testar ideias antes de executar de verdade.';
            } else if (p.forca === 2 && p.habilidade === 2) {
                tipo = 'Organizador Natural';
                pontosFortes.push('Talento para estruturar e organizar');
                pontosFortes.push('Busca por eficiência e ordem');
                pontosAtencao.push('Pode se prender demais a sistemas e perder flexibilidade');
                pontosAtencao.push('Risco de perfeccionismo paralisante');
                recomendacao = 'Use sua habilidade organizacional para criar um sistema pessoal, mas lembre-se: a ação imperfeita supera o planejamento perfeito.';
                iaInsight = 'Automatize a estruturação com IA e libere energia para o que realmente importa: executar.';
            } else {
                tipo = 'Em Transição';
                pontosFortes.push('Autoconhecimento em desenvolvimento');
                pontosFortes.push('Disposição para identificar áreas de melhoria');
                pontosAtencao.push('Múltiplas frentes para trabalhar simultaneamente');
                pontosAtencao.push('Necessidade de um plano estruturado de evolução');
                recomendacao = 'Seu perfil indica que você está no momento certo para adotar um sistema integrado. O Nexus Manual foi desenhado para pessoas exatamente como você.';
                iaInsight = 'A IA pode ser o acelerador que faltava para você sair da transição e entrar em evolução consistente.';
            }

            if (p.ia >= 2) pontosFortes.push('Familiaridade com IA como vantagem competitiva');
            if (p.habilidade === 3) pontosFortes.push('Busca por clareza decisória – sinal de maturidade');
            if (p.obstaculo === 1) pontosAtencao.push('Gestão do tempo é uma oportunidade de melhoria imediata');
            if (p.forca === 1) pontosFortes.push('Criatividade como diferencial para inovação');
            if (p.forca === 3) pontosFortes.push('Capacidade analítica para resolver problemas complexos');

            return {
                tipo,
                pontosFortes: [...new Set(pontosFortes)],
                pontosAtencao: [...new Set(pontosAtencao)],
                recomendacao,
                iaInsight
            };
        }

        async function runNarrative() {
            if (step === 1) {
                await addMessage(
                    `Prazer, <strong>${userName}</strong>.<br><br>Sabia que <strong>8 em cada 10 pessoas</strong> não usam a IA em todo o seu potencial?<br><br>Algumas até têm receio. Outras simplesmente não sabem por onde começar.<br><br>Este diagnóstico vai revelar como você pode usar a tecnologia de forma inteligente — a seu favor, sem medo e sem exageros.`,
                    'assistant'
                );
                await new Promise(r => setTimeout(r, 800));

                const choice = await waitForOption([
                    'Muitas ideias, mas dificuldade para executar',
                    'Estudo bastante, mas esqueço o que aprendo',
                    'Perco tempo com tarefas repetitivas',
                    'Dificuldade para manter foco e disciplina'
                ]);
                profile.perfil = choice.index;
                await addMessage(choice.text, 'user');
                updateProgress(1);
                step = 2; runNarrative();
            } else if (step === 2) {
                await addMessage(`Como você se relaciona com a Inteligência Artificial hoje?`, 'assistant');
                const choice = await waitForOption([
                    'Nunca utilizei',
                    'Utilizo ocasionalmente',
                    'Utilizo frequentemente',
                    'Utilizo todos os dias'
                ]);
                profile.ia = choice.index;
                await addMessage(choice.text, 'user');
                updateProgress(2);
                step = 3; runNarrative();
            } else if (step === 3) {
                await addMessage(`Se pudesse melhorar apenas UMA habilidade, qual seria?`, 'assistant');
                const choice = await waitForOption([
                    'Aprender mais rápido',
                    'Ser mais produtivo',
                    'Organizar melhor minha rotina',
                    'Tomar decisões melhores'
                ]);
                profile.habilidade = choice.index;
                await addMessage(choice.text, 'user');
                updateProgress(3);
                step = 4; runNarrative();
            } else if (step === 4) {
                await addMessage(`Em relação ao volume de informações que você consome, como se sente?`, 'assistant');
                const choice = await waitForOption([
                    'Sobrecarregado, mal consigo processar',
                    'Intenso, mas ainda dou conta',
                    'Razoável, mas poderia aproveitar melhor',
                    'Tranquilo, mas falta um método'
                ]);
                profile.informacao = choice.index;
                await addMessage(choice.text, 'user');
                updateProgress(4);
                step = 5; runNarrative();
            } else if (step === 5) {
                await addMessage(`O que mais atrapalha seus objetivos atualmente?`, 'assistant');
                const choice = await waitForOption([
                    'Foco e concentração',
                    'Gestão do tempo',
                    'Falta de clareza nos objetivos',
                    'Motivação inconstante'
                ]);
                profile.obstaculo = choice.index;
                await addMessage(choice.text, 'user');
                updateProgress(5);
                step = 6; runNarrative();
            } else if (step === 6) {
                await addMessage(`Como você aprende melhor?`, 'assistant');
                const choice = await waitForOption([
                    'Lendo e fazendo anotações',
                    'Assistindo vídeos e ouvindo explicações',
                    'Praticando e experimentando',
                    'Ensinando ou discutindo com outros'
                ]);
                profile.aprendizado = choice.index;
                await addMessage(choice.text, 'user');
                updateProgress(6);
                step = 7; runNarrative();
            } else if (step === 7) {
                await addMessage(`Qual você considera sua maior força?`, 'assistant');
                const choice = await waitForOption([
                    'Resiliência e determinação',
                    'Criatividade e inovação',
                    'Organização e planejamento',
                    'Análise e pensamento crítico'
                ]);
                profile.forca = choice.index;
                await addMessage(choice.text, 'user');
                updateProgress(7);
                step = 8; runNarrative();
            } else if (step === 8) {
                await addMessage(`Processando seu diagnóstico personalizado...`, 'assistant');
                await new Promise(r => setTimeout(r, 1800));
                const diag = gerarDiagnostico(profile);
                await addMessage(
                    `<strong>${userName}, seu perfil é: ${diag.tipo}</strong><br><br>` +
                    `✅ <strong>Forças:</strong><br>• ${diag.pontosFortes.join('<br>• ')}<br><br>` +
                    `⚠️ <strong>Atenção:</strong><br>• ${diag.pontosAtencao.join('<br>• ')}`,
                    'assistant'
                );
                await new Promise(r => setTimeout(r, 2500));
                await addMessage(
                    `<strong>Como a IA pode te ajudar:</strong><br>${diag.iaInsight}<br><br>O Nexus Manual foi criado exatamente para unir inteligência humana e artificial em um único sistema.`,
                    'assistant'
                );
                step = 9; runNarrative();
            } else if (step === 9) {
                await addMessage(`Clique no botão abaixo e veja como dominar a IA de forma inteligente — sem medo, sem dependência, com resultado.`, 'assistant');
                inputContainer.style.opacity = '0';
                setTimeout(() => {
                    inputContainer.style.display = 'none';
                    finalCta.style.display = 'block';
                    setTimeout(() => {
                        chatContainer.scrollTo({
                            top: chatContainer.scrollHeight,
                            behavior: 'smooth'
                        });
                    }, 300);
                }, 600);
            }
        }

        async function handleSend() {
            const text = userInput.value.trim();
            if (!text) return;
            userInput.value = "";

            if (step === 0) {
                const patterns = [/(?:nome é|sou o|sou a|me chamo)\s*([A-Za-zÀ-ÿ]+)/i, /^([A-Za-zÀ-ÿ]{3,})/i];
                let nome = "";
                for (let p of patterns) {
                    const m = text.match(p);
                    if (m && m[1]) {
                        nome = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
                        break;
                    }
                }
                if (!nome) {
                    nome = text.length >= 2 ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
                }
                userName = nome;
                await addMessage(text, 'user');
                step = 1;
                runNarrative();
            }
        }

        sendBtn.addEventListener('click', handleSend);
        userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

        finalCtaBtn.addEventListener('click', () => {
            const leadData = {
                nome: userName,
                perfil: profile.perfil,
                ia: profile.ia,
                habilidade: profile.habilidade,
                informacao: profile.informacao,
                obstaculo: profile.obstaculo,
                aprendizado: profile.aprendizado,
                forca: profile.forca,
                data: new Date().toISOString()
            };
            localStorage.setItem('nexus_lead', JSON.stringify(leadData));
            
            finalCtaBtn.textContent = 'SALVANDO...';
            finalCtaBtn.style.opacity = '0.7';
            setTimeout(() => {
                window.location.href = 'https://app.nexus-manual.com.br/';
            }, 600);
        });

        window.onload = async () => {
            await new Promise(r => setTimeout(r, 800));
            await addMessage(
                `<strong>Bem-vindo ao Ecossistema Nexus.</strong><br><br>A Inteligência Artificial já está mudando a forma como trabalhamos, aprendemos e decidimos.<br><br>Mas a maioria das pessoas ainda não descobriu como usá-la a seu favor — e algumas até têm receio.<br><br>Este diagnóstico de 2 minutos vai revelar se você está pronto para usar a IA de forma inteligente.<br><br>Para iniciarmos me diga qual é o seu nome?`,
                'assistant'
            );
        };
    </script>
</body>
</html>
