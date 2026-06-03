-- ==========================================
-- 1. POPULANDO CATEGORIAS (tb_category)
-- ==========================================
INSERT INTO tb_category (name) VALUES ('Periféricos');
INSERT INTO tb_category (name) VALUES ('Jogos');
INSERT INTO tb_category (name) VALUES ('PC e Hardware');
INSERT INTO tb_category (name) VALUES ('Monitores');
INSERT INTO tb_category (name) VALUES ('Cadeiras');
INSERT INTO tb_category (name) VALUES ('Consoles');
INSERT INTO tb_category (name) VALUES ('Serviços e Conectividade');
INSERT INTO tb_category (name) VALUES ('Notebooks Gamer');
INSERT INTO tb_category (name) VALUES ('Áudio e Streaming');
INSERT INTO tb_category (name) VALUES ('Realidade Virtual');
INSERT INTO tb_category (name) VALUES ('Mesa e Setup');
INSERT INTO tb_category (name) VALUES ('Acessórios e Cabos');
-- Inspiradas em departamentos de e-commerce (ex.: Kabum), foco gamer
INSERT INTO tb_category (name) VALUES ('Computadores');
INSERT INTO tb_category (name) VALUES ('Celular e Smartphone');
INSERT INTO tb_category (name) VALUES ('TV Gamer');
INSERT INTO tb_category (name) VALUES ('Gift Cards e Assinaturas');
INSERT INTO tb_category (name) VALUES ('Tablets e Handhelds');
INSERT INTO tb_category (name) VALUES ('Espaço Gamer');
INSERT INTO tb_category (name) VALUES ('Energia');
INSERT INTO tb_category (name) VALUES ('Geek e Colecionáveis');
INSERT INTO tb_category (name) VALUES ('Casa Inteligente');
INSERT INTO tb_category (name) VALUES ('Projetores');

-- ==========================================
-- 2. POPULANDO PRODUTOS (tb_product) — catálogo
-- ==========================================
-- Periféricos (categoria 1)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Teclado Gaming Redragon', 'Teclado mecânico switch blue com RGB', 1, FALSE, '/images/image1.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mouse Gaming Logitech G203', 'Mouse com sensor ótico de 8000 DPI', 1, FALSE, '/images/image2.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Headset HyperX Cloud II', 'Headset fechado com som surround 7.1 virtual', 1, FALSE, '/images/image3.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mousepad Gamer XL RGB', 'Mousepad estendido 90x40cm com borda RGB', 1, FALSE, '/images/image4.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Webcam Logitech C920', 'Webcam Full HD 1080p para streaming', 1, FALSE, '/images/image5.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Controle Xbox Wireless', 'Controle sem fio compatível com PC e Xbox', 6, FALSE, '/images/image6.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Teclado Logitech G Pro', 'Teclado mecânico compacto para eSports', 1, FALSE, '/images/image7.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Fone Razer Kraken X', 'Fone leve com drivers 40mm e microfone cardioide', 1, FALSE, '/images/image8.jpg');

-- Jogos digitais (categoria 2)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Project Zomboid', 'Jogo de sobrevivência zombie hardcore (+18)', 2, TRUE, '/images/image9.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Grand Theft Auto V', 'Ação e aventura em mundo aberto (+18)', 2, TRUE, '/images/image10.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cyberpunk 2077', 'RPG futurista em Night City (+18)', 2, TRUE, '/images/image11.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Elden Ring', 'RPG de ação da FromSoftware em mundo aberto', 2, TRUE, '/images/image12.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Hogwarts Legacy', 'Aventura no universo Harry Potter', 2, FALSE, '/images/image13.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Red Dead Redemption 2', 'Faroeste épico da Rockstar (+18)', 2, TRUE, '/images/image14.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('EA Sports FC 24', 'Simulador de futebol da temporada 2024', 2, FALSE, '/images/image15.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Minecraft Java Edition', 'Sandbox criativo versão Java para PC', 2, FALSE, '/images/image16.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Counter-Strike 2', 'FPS tático competitivo da Valve', 2, FALSE, '/images/image17.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('The Witcher 3: Wild Hunt', 'RPG de fantasia premiado da CD Projekt', 2, TRUE, '/images/image18.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Baldurs Gate 3', 'RPG tático baseado em D&D', 2, TRUE, '/images/image19.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Stardew Valley', 'Simulador de fazenda indie relaxante', 2, FALSE, '/images/image20.jpg');

-- Hardware (categoria 3)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Placa Gráfica RTX 4060', 'NVIDIA GeForce RTX 4060 8GB', 3, FALSE, '/images/image21.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Placa Gráfica RTX 4070 Super', 'NVIDIA GeForce RTX 4070 Super 12GB', 3, FALSE, '/images/image22.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Processador AMD Ryzen 7 5800X', 'CPU 8 núcleos 16 threads AM4', 3, FALSE, '/images/image23.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('SSD NVMe Samsung 990 1TB', 'SSD PCIe 4.0 leitura até 7450 MB/s', 3, FALSE, '/images/image24.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Memória Kingston Fury 16GB', 'Kit DDR4 3200MHz dual channel', 3, FALSE, '/images/image25.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Gabinete Gamer RGB ATX', 'Gabinete mid-tower com 4 fans ARGB', 3, FALSE, '/images/image26.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Fonte Corsair RM750e 750W', 'Fonte modular 80 Plus Gold', 3, FALSE, '/images/image27.jpg');

-- Monitores (categoria 4)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor LG Ultrawide 29', 'Monitor 29 polegadas IPS Full HD', 4, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor Samsung Odyssey G5 27', 'Monitor curvo 144Hz QHD 1ms', 4, FALSE, '/images/image29.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor AOC 24G2 24', 'Monitor IPS 144Hz para competir', 4, FALSE, '/images/image28.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor Dell UltraSharp 32 4K', 'Monitor 32 polegadas 4K IPS', 4, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor ASUS TUF 27 165Hz', 'Monitor gaming 27 polegadas IPS', 4, FALSE, '/images/Logo.png');

-- Cadeiras gaming (categoria 5)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira Gaming DXRacer', 'Cadeira ergonómica reclinável preta', 5, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira ThunderX3 TC3', 'Cadeira com apoio lombar e reclinação 180°', 5, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira Flexform Ergo', 'Cadeira ergonómica para longas sessões', 5, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira Nitro Concepts S300', 'Cadeira inspirada em esportivos com almofadas', 5, FALSE, '/images/Logo.png');

-- Consoles (categoria 6)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Console Xbox Series S', 'Console digital 512GB com Game Pass trial', 6, FALSE, '/images/image32.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('PlayStation 5 Slim', 'Console Sony com SSD 1TB e controle DualSense', 6, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Nintendo Switch OLED', 'Console híbrido com tela OLED 7 polegadas', 6, FALSE, '/images/Logo.png');

-- Armazenamento (categoria 7)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('SSD NVMe WD Black 2TB', 'SSD PCIe 4.0 para jogos com dissipador', 3, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('HD Externo Seagate 4TB', 'HD USB 3.0 para backup e biblioteca de jogos', 3, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cartão microSD 512GB', 'Cartão A2 para Steam Deck e Nintendo Switch', 3, FALSE, '/images/Logo.png');

-- Serviços e conectividade (categoria 7) — rede
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Roteador Wi-Fi 6 TP-Link', 'Roteador AX1800 para baixa latência em jogos', 7, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mesh Wi-Fi 6 2-pack', 'Sistema mesh para cobertura em toda a casa', 7, FALSE, '/images/Logo.png');

-- Notebooks Gamer (categoria 8)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Notebook Acer Nitro 5', 'Intel i5, RTX 4050, 16GB RAM, SSD 512GB', 8, FALSE, '/images/image31.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Notebook Lenovo Legion 5', 'AMD Ryzen 7, RTX 4060, 16GB RAM, tela 165Hz', 8, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Notebook ASUS TUF A15', 'Ryzen 7, RTX 4070, 32GB RAM, SSD 1TB', 8, FALSE, '/images/Logo.png');

-- Áudio e Streaming (categoria 9)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Microfone Blue Yeti', 'Microfone USB condensador para stream e podcast', 9, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Placa de Captura Elgato HD60 X', 'Captura 4K60 HDR para console e PC', 9, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mixer de Áudio Behringer', 'Mesa compacta com 2 canais para live', 9, FALSE, '/images/Logo.png');

-- Realidade Virtual (categoria 10)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Meta Quest 3 128GB', 'Headset VR standalone com controles Touch Plus', 10, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('PlayStation VR2', 'Headset VR para PS5 com eye tracking', 10, FALSE, '/images/Logo.png');

-- Mesa e Setup (categoria 11)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mesa Gamer Eletrificada 140cm', 'Mesa com USB, RGB e ajuste de altura', 11, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Suporte Articulado para Monitor', 'Braço duplo VESA até 32 polegadas', 11, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Ring Light 18 polegadas', 'Iluminação LED com tripé para stream', 11, FALSE, '/images/Logo.png');

-- Acessórios e Cabos (categoria 12)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Kit Cabos HDMI 2.1 3m', 'Pacote com 2 cabos 4K 120Hz', 12, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Hub USB-C 7 em 1', 'Hub com HDMI, USB 3.0 e leitor SD', 12, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Base Refrigerada Notebook', 'Cooler com 5 fans ajustáveis e USB', 12, FALSE, '/images/Logo.png');

-- Gift Cards e Assinaturas (categoria 16)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Xbox Game Pass Ultimate 3 meses', 'Assinatura digital com catálogo de centenas de jogos', 16, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('PlayStation Plus Extra 12 meses', 'Assinatura anual com jogos mensais', 16, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Gift Card Steam R$ 100', 'Crédito digital para loja Steam', 16, FALSE, '/images/image30.jpg');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Gift Card Nintendo eShop R$ 150', 'Crédito digital para Nintendo Switch', 16, FALSE, '/images/Logo.png');

-- Computadores (categoria 13)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('PC Gamer Intel i7 RTX 4070', 'Desktop montado 32GB RAM, SSD 1TB, Wi-Fi 6', 13, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('PC Gamer AMD Ryzen 5 RTX 4060', 'Desktop entry level para 1080p alto', 13, FALSE, '/images/Logo.png');

-- Celular e Smartphone (categoria 14)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Smartphone Gamer 256GB', 'Tela 144Hz, Snapdragon, bateria 5000mAh', 14, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Controle Backbone para iPhone', 'Controle clip-on para jogos mobile', 14, FALSE, '/images/Logo.png');

-- TV Gamer (categoria 15)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Smart TV 55 4K 120Hz', 'TV com HDMI 2.1 e modo jogo ALLM', 15, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Smart TV 43 4K', 'TV compacta para quarto gamer', 15, FALSE, '/images/Logo.png');

-- Tablets e Handhelds (categoria 17)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Steam Deck OLED 512GB', 'Handheld PC portátil com tela OLED', 17, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Tablet Samsung Tab S9', 'Tablet AMOLED 11 polegadas para cloud gaming', 17, FALSE, '/images/Logo.png');

-- Espaço Gamer (categoria 18)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Kit Setup Gamer Completo', 'Mesa + suporte headset + organizador de cabos', 18, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Tapete Antiestático XL', 'Tapete 120x60cm para cadeira e periféricos', 18, FALSE, '/images/Logo.png');

-- Energia (categoria 19)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Nobreak Gamer 1200VA', 'UPS com proteção para PC e console', 19, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Estabilizador 1500VA', 'Proteção contra surtos na rede elétrica', 19, FALSE, '/images/Logo.png');

-- Geek e Colecionáveis (categoria 20)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Action Figure Edição Colecionador', 'Figura 30cm de personagem de game', 20, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Camiseta Gamer Licenciada', 'Camiseta algodão estampa exclusiva', 20, FALSE, '/images/Logo.png');

-- Casa Inteligente (categoria 21)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Lâmpada LED RGB Wi-Fi', 'Lâmpada inteligente compatível com Alexa', 21, FALSE, '/images/Logo.png');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Tomada Inteligente 2-pack', 'Tomada Wi-Fi para automação do setup', 21, FALSE, '/images/Logo.png');

-- Projetores (categoria 22)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Projetor Gaming 1080p 120Hz', 'Projetor short throw para sala gamer', 22, FALSE, '/images/Logo.png');

-- ==========================================
-- 3. VARIAÇÕES (tb_product_variant)
-- item_condition: NEW | SEMI_NEW | USED
-- ==========================================
-- Periféricos (produtos 1–8)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (1, 'Unidade — novo', 'TEC-REDRAGON-01', 350.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (2, 'Unidade — novo', 'MOU-G203-01', 150.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (3, 'Unidade — novo', 'HEA-HYPERX-01', 499.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (4, 'Unidade — novo', 'PAD-XLRGB-01', 89.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (5, 'Unidade — novo', 'WEB-C920-01', 429.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (6, 'Unidade — novo', 'CTL-XBOX-01', 399.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (6, 'Revenda — usado', 'CTL-XBOX-USED', 249.00, 'PHYSICAL', 'UNIVERSAL', 'USED', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (7, 'Unidade — novo', 'TEC-GPRO-01', 649.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (8, 'Unidade — novo', 'FON-KRAKEN-01', 279.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Jogos digitais (produtos 9–20)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (9, 'Chave Steam', 'JOGO-ZOMBOID-STEAM', 100.00, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (10, 'Chave PS5', 'JOGO-GTAV-PS5-DIG', 89.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (10, 'Chave Xbox Series', 'JOGO-GTAV-XBOX-DIG', 89.90, 'DIGITAL', 'XBOX_SERIES', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (10, 'Chave Steam', 'JOGO-GTAV-STEAM', 79.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (11, 'Chave Steam', 'JOGO-CYBER-STEAM', 149.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (11, 'Chave PS5', 'JOGO-CYBER-PS5-DIG', 159.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (12, 'Chave Steam', 'JOGO-ELDEN-STEAM', 199.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (12, 'Chave PS5', 'JOGO-ELDEN-PS5-DIG', 209.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (12, 'Chave Xbox Series', 'JOGO-ELDEN-XBOX-DIG', 209.90, 'DIGITAL', 'XBOX_SERIES', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (13, 'Chave Steam', 'JOGO-HOGW-STEAM', 179.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (14, 'Chave Steam', 'JOGO-RDR2-STEAM', 99.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (14, 'Chave PS5', 'JOGO-RDR2-PS5-DIG', 109.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (15, 'Chave PS5', 'JOGO-FC24-PS5-DIG', 249.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (15, 'Chave Xbox Series', 'JOGO-FC24-XBOX-DIG', 249.90, 'DIGITAL', 'XBOX_SERIES', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (16, 'Chave Java', 'JOGO-MINE-JAVA', 119.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (17, 'Chave Steam', 'JOGO-CS2-STEAM', 29.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (18, 'Chave Steam', 'JOGO-WITCH3-STEAM', 59.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (18, 'Chave PS5', 'JOGO-WITCH3-PS5-DIG', 69.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (19, 'Chave Steam', 'JOGO-BG3-STEAM', 159.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (20, 'Chave Steam', 'JOGO-STARDEW-STEAM', 39.90, 'DIGITAL', 'STEAM', 'NEW', TRUE);

-- Jogos — mídia física (discos enviados)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (10, 'Mídia física PS5 — lacrado', 'JOGO-GTAV-PS5-PHY-NEW', 199.90, 'PHYSICAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (10, 'Mídia física PS5 — usado', 'JOGO-GTAV-PS5-PHY-USED', 89.90, 'PHYSICAL', 'PS5', 'USED', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (10, 'Mídia física Xbox — lacrado', 'JOGO-GTAV-XBOX-PHY-NEW', 189.90, 'PHYSICAL', 'XBOX_SERIES', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (11, 'Mídia física PS5 — lacrado', 'JOGO-CYBER-PS5-PHY-NEW', 229.90, 'PHYSICAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (11, 'Mídia física PS5 — semi-novo', 'JOGO-CYBER-PS5-PHY-SEMI', 169.90, 'PHYSICAL', 'PS5', 'SEMI_NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (12, 'Mídia física PS5 — lacrado', 'JOGO-ELDEN-PS5-PHY-NEW', 279.90, 'PHYSICAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (12, 'Mídia física Xbox — usado', 'JOGO-ELDEN-XBOX-PHY-USED', 149.90, 'PHYSICAL', 'XBOX_SERIES', 'USED', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (14, 'Mídia física PS5 — lacrado', 'JOGO-RDR2-PS5-PHY-NEW', 179.90, 'PHYSICAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (14, 'Mídia física PS5 — usado', 'JOGO-RDR2-PS5-PHY-USED', 79.90, 'PHYSICAL', 'PS5', 'USED', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (15, 'Mídia física PS5 — lacrado', 'JOGO-FC24-PS5-PHY-NEW', 299.90, 'PHYSICAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (18, 'Mídia física PS5 — lacrado', 'JOGO-WITCH3-PS5-PHY-NEW', 129.90, 'PHYSICAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (18, 'Mídia física PS5 — usado', 'JOGO-WITCH3-PS5-PHY-USED', 59.90, 'PHYSICAL', 'PS5', 'USED', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (20, 'Cartucho Switch — lacrado', 'JOGO-STARDEW-SW-PHY-NEW', 179.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Hardware (produtos 21–27)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (21, 'Unidade — novo', 'HW-RTX4060-01', 2500.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (21, 'Revenda — semi-novo', 'HW-RTX4060-SEMI', 1899.00, 'PHYSICAL', 'UNIVERSAL', 'SEMI_NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (22, 'Unidade — novo', 'HW-RTX4070S-01', 3899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (23, 'Unidade — novo', 'HW-RYZEN7-01', 1299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (24, 'Unidade — novo', 'HW-SSD990-01', 549.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (25, 'Unidade — novo', 'HW-RAM16-01', 329.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (26, 'Unidade — novo', 'HW-GABINETE-01', 459.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (27, 'Unidade — novo', 'HW-FONTE750-01', 699.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Monitores (produtos 28–32)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (28, 'Unidade — novo', 'MON-LG29-01', 1200.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (29, 'Unidade — novo', 'MON-SAMSUNG-01', 1899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (30, 'Unidade — novo', 'MON-AOC24-01', 1099.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (31, 'Unidade — novo', 'MON-DELL32-01', 3299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (32, 'Unidade — novo', 'MON-ASUS27-01', 1599.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (32, 'Revenda — usado', 'MON-ASUS27-USED', 999.00, 'PHYSICAL', 'UNIVERSAL', 'USED', TRUE);

-- Cadeiras (produtos 33–36)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (33, 'Unidade — novo', 'CAD-DXRACER-01', 1500.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (34, 'Unidade — novo', 'CAD-THUNDER-01', 1299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (35, 'Unidade — novo', 'CAD-FLEX-01', 999.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (36, 'Unidade — novo', 'CAD-NITRO-01', 1799.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Consoles (37–39)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (37, 'Unidade — novo', 'CON-XSS-01', 2199.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (37, 'Revenda — usado', 'CON-XSS-USED', 1599.00, 'PHYSICAL', 'UNIVERSAL', 'USED', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (38, 'Unidade — novo', 'CON-PS5-01', 3999.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (38, 'Revenda — semi-novo', 'CON-PS5-SEMI', 3299.00, 'PHYSICAL', 'UNIVERSAL', 'SEMI_NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (39, 'Unidade — novo', 'CON-SWITCH-01', 2499.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Armazenamento (40–42)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (40, 'Unidade — novo', 'STO-WD2TB-01', 899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (41, 'Unidade — novo', 'STO-SEA4TB-01', 699.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (42, 'Unidade — novo', 'STO-SD512-01', 349.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Redes (43–44)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (43, 'Unidade — novo', 'NET-TPLINK-01', 499.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (44, 'Unidade — novo', 'NET-MESH-01', 899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Gift Cards e Assinaturas (59–62) — códigos digitais
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (59, 'Código digital Xbox', 'SUB-GPU-3M', 89.90, 'DIGITAL', 'XBOX_SERIES', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (60, 'Código digital PSN', 'SUB-PSPLUS-12', 399.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (61, 'Código digital Steam', 'GC-STEAM-100', 100.00, 'DIGITAL', 'STEAM', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (62, 'Código digital eShop', 'GC-ESHOP-150', 150.00, 'DIGITAL', 'UNIVERSAL', 'NEW', TRUE);

-- Notebooks Gamer (45–47)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (45, 'Unidade — novo', 'NB-ACER-NITRO5', 5499.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (46, 'Unidade — novo', 'NB-LENOVO-LEG5', 7299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (46, 'Revenda — semi-novo', 'NB-LENOVO-LEG5-SEMI', 6299.00, 'PHYSICAL', 'UNIVERSAL', 'SEMI_NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (47, 'Unidade — novo', 'NB-ASUS-TUF15', 8999.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Áudio e Streaming (48–50)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (48, 'Unidade — novo', 'AUD-YETI-01', 899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (49, 'Unidade — novo', 'AUD-ELGATO-HD60', 1299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (50, 'Unidade — novo', 'AUD-BEHRINGER-01', 649.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Realidade Virtual (51–52)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (51, 'Unidade — novo', 'VR-QUEST3-128', 4299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (52, 'Unidade — novo', 'VR-PSVR2-01', 3999.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (52, 'Revenda — usado', 'VR-PSVR2-USED', 2999.00, 'PHYSICAL', 'UNIVERSAL', 'USED', TRUE);

-- Mesa e Setup (53–55)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (53, 'Unidade — novo', 'SET-MESA-140', 1899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (54, 'Unidade — novo', 'SET-BRACO-MON', 349.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (55, 'Unidade — novo', 'SET-RING-18', 279.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Acessórios e Cabos (56–58)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (56, 'Unidade — novo', 'ACC-HDMI-3M', 89.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (57, 'Unidade — novo', 'ACC-HUB-USBC', 199.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (58, 'Unidade — novo', 'ACC-COOLER-NB', 159.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Computadores (63–64)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (63, 'Unidade — novo', 'PC-INTEL-4070', 8999.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (64, 'Unidade — novo', 'PC-RYZEN-4060', 5499.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Celular e Smartphone (65–66)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (65, 'Unidade — novo', 'CEL-GAMER-256', 3299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (66, 'Unidade — novo', 'ACC-BACKBONE', 399.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- TV Gamer (67–68)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (67, 'Unidade — novo', 'TV-55-4K120', 3999.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (68, 'Unidade — novo', 'TV-43-4K', 2499.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Tablets e Handhelds (69–70)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (69, 'Unidade — novo', 'HAND-STEAMDECK', 4999.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (70, 'Unidade — novo', 'TAB-S9-11', 4299.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Espaço Gamer (71–72)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (71, 'Unidade — novo', 'ESP-KIT-SETUP', 899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (72, 'Unidade — novo', 'ESP-TAPETE-XL', 199.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Energia (73–74)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (73, 'Unidade — novo', 'ENG-NOBREAK-12', 899.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (74, 'Unidade — novo', 'ENG-ESTAB-15', 349.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Geek e Colecionáveis (75–76)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (75, 'Unidade — novo', 'GEEK-FIGURE-01', 299.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (76, 'Unidade — novo', 'GEEK-CAMISETA', 89.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Casa Inteligente (77–78)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (77, 'Unidade — novo', 'SMART-LAMP-RGB', 129.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (78, 'Unidade — novo', 'SMART-TOMADA-2', 159.90, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Projetores (79)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (79, 'Unidade — novo', 'PROJ-GAME-1080', 3499.00, 'PHYSICAL', 'UNIVERSAL', 'NEW', TRUE);

-- Promoções (list_price = preço de tabela; price = preço promocional)
UPDATE tb_product_variant SET list_price = 449.00 WHERE sku = 'TEC-REDRAGON-01';
UPDATE tb_product_variant SET list_price = 199.00 WHERE sku = 'MOU-G203-01';
UPDATE tb_product_variant SET list_price = 649.90 WHERE sku = 'HEA-HYPERX-01';
UPDATE tb_product_variant SET list_price = 129.90 WHERE sku = 'PAD-XLRGB-01';
UPDATE tb_product_variant SET list_price = 549.00 WHERE sku = 'WEB-C920-01';
UPDATE tb_product_variant SET list_price = 499.00 WHERE sku = 'CTL-XBOX-01';
UPDATE tb_product_variant SET list_price = 799.00 WHERE sku = 'TEC-GPRO-01';
UPDATE tb_product_variant SET list_price = 349.90 WHERE sku = 'FON-KRAKEN-01';
UPDATE tb_product_variant SET list_price = 99.90 WHERE sku = 'JOGO-GTAV-STEAM';
UPDATE tb_product_variant SET list_price = 49.90 WHERE sku = 'JOGO-CS2-STEAM';
UPDATE tb_product_variant SET list_price = 79.90 WHERE sku = 'JOGO-WITCH3-STEAM';
UPDATE tb_product_variant SET list_price = 2899.00 WHERE sku = 'HW-RTX4060-01';
UPDATE tb_product_variant SET list_price = 649.90 WHERE sku = 'HW-SSD990-01';
UPDATE tb_product_variant SET list_price = 2299.00 WHERE sku = 'MON-SAMSUNG-01';
UPDATE tb_product_variant SET list_price = 1399.00 WHERE sku = 'MON-AOC24-01';
UPDATE tb_product_variant SET list_price = 2499.00 WHERE sku = 'CON-XSS-01';
UPDATE tb_product_variant SET list_price = 6499.00 WHERE sku = 'NB-ACER-NITRO5';
UPDATE tb_product_variant SET list_price = 119.90 WHERE sku = 'GC-STEAM-100';
UPDATE tb_product_variant SET list_price = 4999.00 WHERE sku = 'HAND-STEAMDECK';

-- ==========================================
-- 4. POPULANDO UTILIZADORES (tb_user)
-- A senha padrão é password
-- ==========================================
INSERT INTO tb_user (username, display_name, full_name, birth_date, email, cpf, phone, password, newsletter_subscription, terms_accepted, parent_id) VALUES ('admin', 'Administrador', 'Administrador do Sistema', '1990-01-01', 'admin@nexus.com.br', '06569168007', '46999999999', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', TRUE, TRUE, NULL);
INSERT INTO tb_user (username, display_name, full_name, birth_date, email, cpf, phone, password, newsletter_subscription, terms_accepted, parent_id) VALUES ('enzo15', 'Enzo', 'Enzo da Silva Santos', '2011-05-10', 'enzo@nexus.com.br', '59341647038', '46999998888', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', FALSE, TRUE, 1);
INSERT INTO tb_user (username, display_name, full_name, birth_date, email, cpf, phone, password, newsletter_subscription, terms_accepted, parent_id) VALUES ('maria_gamer', 'Maria', 'Maria Costa Ferreira', '1998-08-20', 'maria@gmail.com', '82645063004', '46988887777', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', TRUE, TRUE, NULL);
INSERT INTO tb_user (username, display_name, full_name, birth_date, email, cpf, phone, password, newsletter_subscription, terms_accepted, parent_id) VALUES ('lucas_pro', 'Lucas', 'Lucas Costa Ferreira', '2013-03-15', 'lucas@gmail.com', '40638513009', '46988887777', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', FALSE, TRUE, 3);

-- ==========================================
-- 5. POPULANDO CUPÕES E TRANSPORTADORAS
-- ==========================================
INSERT INTO tb_coupon (code, discount_value, discount_type, start_date, end_date, target_type, target_id, min_purchase_value, active, first_purchase_only) VALUES ('NEXUS10', 10.00, 'PERCENTAGE', '2026-01-01', '2026-12-31', 'ALL', NULL, 100.00, TRUE, FALSE);
INSERT INTO tb_coupon (code, discount_value, discount_type, start_date, end_date, target_type, target_id, min_purchase_value, active, first_purchase_only) VALUES ('BEMVINDO20', 20.00, 'PERCENTAGE', '2026-01-01', '2026-12-31', 'ALL', NULL, NULL, TRUE, TRUE);

INSERT INTO tb_carrier(name, base_rate, estimated_delivery_days, is_active) VALUES ('Correios PAC', 15.00, 5, true);
INSERT INTO tb_carrier(name, base_rate, estimated_delivery_days, is_active) VALUES ('Correios SEDEX', 35.00, 2, true);

-- ==========================================
-- 6. POPULANDO ENDEREÇOS (tb_address)
-- ==========================================
INSERT INTO tb_address (city, neighborhood, number, state, street, zip_code, user_id, is_active) VALUES ('Pato Branco', 'Centro', '123', 'PR', 'Rua Guarani', '85501-000', 1, TRUE);
INSERT INTO tb_address (city, neighborhood, number, state, street, zip_code, user_id, is_active) VALUES ('Pato Branco', 'La Salle', '456', 'PR', 'Rua Tapajós', '85501-100', 2, TRUE);
INSERT INTO tb_address (city, neighborhood, number, state, street, zip_code, user_id, is_active) VALUES ('Curitiba', 'Batel', '10', 'PR', 'Avenida do Batel', '80420-090', 3, TRUE);
INSERT INTO tb_address (city, neighborhood, number, state, street, zip_code, user_id, is_active) VALUES ('Curitiba', 'Água Verde', '55A', 'PR', 'Rua Bento Viana', '80240-110', 3, TRUE);
INSERT INTO tb_address (city, neighborhood, number, state, street, zip_code, user_id, is_active) VALUES ('Curitiba', 'Batel', '10', 'PR', 'Avenida do Batel', '80420-090', 4, TRUE);

-- ==========================================
-- 7. PEDIDOS (tb_order) E ITENS (tb_order_item)
-- ==========================================
INSERT INTO tb_order (order_date, total, user_id, address_id) VALUES ('2026-04-15', 350.00, 1, 1);
INSERT INTO tb_order (order_date, total, user_id, address_id) VALUES ('2026-04-20', 1350.00, 3, 3);
INSERT INTO tb_order (order_date, total, user_id, address_id) VALUES ('2026-04-22', 79.90, 3, 4);

INSERT INTO tb_order_item (order_id, variant_id, quantity, unit_price) VALUES (1, 1, 1, 350.00);
INSERT INTO tb_order_item (order_id, variant_id, quantity, unit_price) VALUES (2, 28, 1, 1200.00);
INSERT INTO tb_order_item (order_id, variant_id, quantity, unit_price) VALUES (2, 2, 1, 150.00);
INSERT INTO tb_order_item (order_id, variant_id, quantity, unit_price) VALUES (3, 12, 1, 79.90);
