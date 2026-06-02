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

-- ==========================================
-- 2. POPULANDO PRODUTOS (tb_product) — catálogo
-- ==========================================
-- Periféricos (categoria 1)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Teclado Gaming Redragon', 'Teclado mecânico switch blue com RGB', 1, FALSE, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mouse Gaming Logitech G203', 'Mouse com sensor ótico de 8000 DPI', 1, FALSE, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Headset HyperX Cloud II', 'Headset fechado com som surround 7.1 virtual', 1, FALSE, 'https://images.unsplash.com/photo-1599669454699-248393a5e18d?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mousepad Gamer XL RGB', 'Mousepad estendido 90x40cm com borda RGB', 1, FALSE, 'https://images.unsplash.com/photo-1618384887920-8476a97d4d0c?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Webcam Logitech C920', 'Webcam Full HD 1080p para streaming', 1, FALSE, 'https://images.unsplash.com/photo-1587826080692-f439cd3fabc5?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Controle Xbox Wireless', 'Controle sem fio compatível com PC e Xbox', 6, FALSE, 'https://images.unsplash.com/photo-1606144042614-bcd7d99b6c63?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Teclado Logitech G Pro', 'Teclado mecânico compacto para eSports', 1, FALSE, 'https://images.unsplash.com/photo-1511467687858-23d96c4e0a11?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Fone Razer Kraken X', 'Fone leve com drivers 40mm e microfone cardioide', 1, FALSE, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80');

-- Jogos digitais (categoria 2)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Project Zomboid', 'Jogo de sobrevivência zombie hardcore (+18)', 2, TRUE, 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Grand Theft Auto V', 'Ação e aventura em mundo aberto (+18)', 2, TRUE, 'https://images.unsplash.com/photo-1605901302628-86d7cb02c385?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cyberpunk 2077', 'RPG futurista em Night City (+18)', 2, TRUE, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Elden Ring', 'RPG de ação da FromSoftware em mundo aberto', 2, TRUE, 'https://images.unsplash.com/photo-1538481199705-c710c4e965a0?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Hogwarts Legacy', 'Aventura no universo Harry Potter', 2, FALSE, 'https://images.unsplash.com/photo-1612287230202-1ff1d85c1e53?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Red Dead Redemption 2', 'Faroeste épico da Rockstar (+18)', 2, TRUE, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('EA Sports FC 24', 'Simulador de futebol da temporada 2024', 2, FALSE, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Minecraft Java Edition', 'Sandbox criativo versão Java para PC', 2, FALSE, 'https://images.unsplash.com/photo-1606144042614-bcd7d99b6c63?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Counter-Strike 2', 'FPS tático competitivo da Valve', 2, FALSE, 'https://images.unsplash.com/photo-1542751117-08027c6ed4b8?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('The Witcher 3: Wild Hunt', 'RPG de fantasia premiado da CD Projekt', 2, TRUE, 'https://images.unsplash.com/photo-1493711662062-85a7c8c1e4e4?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Baldurs Gate 3', 'RPG tático baseado em D&D', 2, TRUE, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Stardew Valley', 'Simulador de fazenda indie relaxante', 2, FALSE, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80');

-- Hardware (categoria 3)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Placa Gráfica RTX 4060', 'NVIDIA GeForce RTX 4060 8GB', 3, FALSE, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Placa Gráfica RTX 4070 Super', 'NVIDIA GeForce RTX 4070 Super 12GB', 3, FALSE, 'https://images.unsplash.com/photo-1591799264318-7f042e74e040?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Processador AMD Ryzen 7 5800X', 'CPU 8 núcleos 16 threads AM4', 3, FALSE, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('SSD NVMe Samsung 990 1TB', 'SSD PCIe 4.0 leitura até 7450 MB/s', 3, FALSE, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Memória Kingston Fury 16GB', 'Kit DDR4 3200MHz dual channel', 3, FALSE, 'https://images.unsplash.com/photo-1562976540-150ebf58e033?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Gabinete Gamer RGB ATX', 'Gabinete mid-tower com 4 fans ARGB', 3, FALSE, 'https://images.unsplash.com/photo-1587202372775-e229f172a9d7?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Fonte Corsair RM750e 750W', 'Fonte modular 80 Plus Gold', 3, FALSE, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80');

-- Monitores (categoria 4)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor LG Ultrawide 29', 'Monitor 29 polegadas IPS Full HD', 4, FALSE, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor Samsung Odyssey G5 27', 'Monitor curvo 144Hz QHD 1ms', 4, FALSE, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor AOC 24G2 24', 'Monitor IPS 144Hz para competir', 4, FALSE, 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor Dell UltraSharp 32 4K', 'Monitor 32 polegadas 4K IPS', 4, FALSE, 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Monitor ASUS TUF 27 165Hz', 'Monitor gaming 27 polegadas IPS', 4, FALSE, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80');

-- Cadeiras gaming (categoria 5)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira Gaming DXRacer', 'Cadeira ergonómica reclinável preta', 5, FALSE, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira ThunderX3 TC3', 'Cadeira com apoio lombar e reclinação 180°', 5, FALSE, 'https://images.unsplash.com/photo-1580480055273-592b5f38f1b4?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira Flexform Ergo', 'Cadeira ergonómica para longas sessões', 5, FALSE, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cadeira Nitro Concepts S300', 'Cadeira inspirada em esportivos com almofadas', 5, FALSE, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80');

-- Consoles (categoria 6)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Console Xbox Series S', 'Console digital 512GB com Game Pass trial', 6, FALSE, 'https://images.unsplash.com/photo-1606144042614-bcd7d99b6c63?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('PlayStation 5 Slim', 'Console Sony com SSD 1TB e controle DualSense', 6, FALSE, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Nintendo Switch OLED', 'Console híbrido com tela OLED 7 polegadas', 6, FALSE, 'https://images.unsplash.com/photo-1578303512597-81aebf224f1d?w=500&q=80');

-- Armazenamento (categoria 7)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('SSD NVMe WD Black 2TB', 'SSD PCIe 4.0 para jogos com dissipador', 3, FALSE, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('HD Externo Seagate 4TB', 'HD USB 3.0 para backup e biblioteca de jogos', 3, FALSE, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Cartão microSD 512GB', 'Cartão A2 para Steam Deck e Nintendo Switch', 3, FALSE, 'https://images.unsplash.com/photo-1625729342355-b78f1f43a70e?w=500&q=80');

-- Serviços e conectividade (categoria 7)
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Roteador Wi-Fi 6 TP-Link', 'Roteador AX1800 para baixa latência em jogos', 7, FALSE, 'https://images.unsplash.com/photo-1606902968464-b3a32b7a4f0b?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Mesh Wi-Fi 6 2-pack', 'Sistema mesh para cobertura em toda a casa', 7, FALSE, 'https://images.unsplash.com/photo-1558494943-ef010cbdcc31?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Xbox Game Pass Ultimate 3 meses', 'Assinatura digital com catálogo de centenas de jogos', 7, FALSE, 'https://images.unsplash.com/photo-1612287230202-1ff1d85c1e53?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('PlayStation Plus Extra 12 meses', 'Assinatura anual com jogos mensais', 7, FALSE, 'https://images.unsplash.com/photo-1605901302628-86d7cb02c385?w=500&q=80');
INSERT INTO tb_product (name, description, category_id, is_adult_only, image) VALUES ('Gift Card Steam R$ 100', 'Crédito digital para loja Steam', 7, FALSE, 'https://images.unsplash.com/photo-1614680376573-df3480a0c6b0?w=500&q=80');

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

-- Streaming / gift cards (45–47) — sempre novo (código digital)
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (45, 'Código digital Xbox', 'SUB-GPU-3M', 89.90, 'DIGITAL', 'XBOX_SERIES', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (46, 'Código digital PSN', 'SUB-PSPLUS-12', 399.90, 'DIGITAL', 'PS5', 'NEW', TRUE);
INSERT INTO tb_product_variant (product_id, label, sku, price, delivery_type, platform, item_condition, is_active) VALUES (47, 'Código digital Steam', 'GC-STEAM-100', 100.00, 'DIGITAL', 'STEAM', 'NEW', TRUE);

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
