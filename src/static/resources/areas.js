var areas = [
    {
        key: 'north',
        th: 'ภาคเหนือ',
        en: 'North',
        areas: [
            {
                key: 'chiang_rai',
                th: 'เชียงราย',
                en: 'Chiang Rai'
            },
            {
                key: 'chiang_mai',
                th: 'เชียงใหม่',
                en: 'Chiang Mai'
            },
            {
                key: 'nan',
                th: 'น่าน',
                en: 'Nan'
            },
            {
                key: 'phayao',
                th: 'พะเยา',
                en: 'Phayao'
            },
            {
                key: 'phrae',
                th: 'แพร่',
                en: 'Phrae'
            },
             {
                 key: 'mae_hong_son',
                 th: 'แม่ฮ่องสอน',
                 en: 'Mae Hong Son'
             },
            {
                key: 'lampang',
                th: 'ลำปาง',
                en: 'Lampang'
            },
             {
                 key: 'lamphun',
                 th: 'ลำพูน',
                 en: 'Lamphun'
             },
             {
                 key: 'uttaradit',
                 th: 'อุตรดิตถ์',
                 en: 'Uttaradit'
             }
        ]
    },
    {
        key: 'north_east',
        th: 'ภาคตะวันออกเฉียงเหนือ',
        en: 'Northeast',
        areas: [
            {
                key: 'kalasin',
                th: 'กาฬสินธุ์',
                en: 'Kalasin'
            },
            {
                key: 'khon_kaen',
                th: 'ขอนแก่น',
                en: 'Kalasin'
            },
            {
                key: 'chaiyaphum',
                th: 'ชัยภูมิ',
                en: 'Chaiyaphum'
            },
            {
                key: 'nakhon_phanom',
                th: 'นครพนม',
                en: 'Nakhon Phanom'
            },
            {
                key: 'nakhon_ratchasima',
                th: 'นครราชสีมา',
                en: 'Nakhon Ratchasima'
            },
            {
                key: 'bueng_kan',
                th: 'บึงกาฬ',
                en: 'Bueng Kan'
            },
            {
                key: 'buri_ram',
                th: 'บุรีรัมย์',
                en: 'Buri Ram'
            },
            {
                key: 'maha_sarakham',
                th: 'มหาสารคาม',
                en: 'Maha Sarakham'
            },
            {
                key: 'mukdahan',
                th: 'มุกดาหาร',
                en: 'Mukdahan'
            },
            {
                key: 'yasothon',
                th: 'ยโสธร',
                en: 'Yasothon'
            },
            {
                key: 'roi_et',
                th: 'ร้อยเอ็ด',
                en: 'Roi Et'
            },
            {
                key: 'loei',
                th: 'เลย',
                en: 'Loei'
            },
            {
                key: 'si_sa_ket',
                th: 'ศรีสะเกษ',
                en: 'Si Sa Ket'
            },
            {
                key: 'sakon_nakhon',
                th: 'สกลนคร',
                en: 'Sakon Nakhon'
            },
            {
                key: 'surin',
                th: 'สุรินทร์',
                en: 'Surin'
            },
            {
                key: 'nong_khai',
                th: 'หนองคาย',
                en: 'Nong Khai'
            },
            {
                key: 'nong_bua_lam_phu',
                th: 'หนองบัวลำภู',
                en: 'Nong Bua Lam Phu'
            },
            {
                key: 'amnat_charoen',
                th: 'อำนาจเจริญ',
                en: 'Amnat Charoen'
            },
            {
                key: 'udon_thani',
                th: 'อุดรธานี',
                en: 'Udon Thani'
            },
            {
                key: 'ubon_ratchathani',
                th: 'อุบลราชธานี',
                en: 'Ubon Ratchathani'
            }
        ]
    },
    {
         key: 'central_region',
         th: 'ภาคกลาง',
         en: 'Central Region',
         areas: [
             {
                 key: 'krung_thep_maha_nakhon',
                 th: 'กรุงเทพมหานครฯ',
                 en: 'Krung Thep Maha Nakhon'
             },
             {
                 key: 'kamphaeng_phet',
                 th: 'กำแพงเพชร',
                 en: 'Kamphaeng Phet'
             },
             {
                 key: 'chai_nat',
                 th: 'ชัยนาท',
                 en: 'Chai Nat'
             },
             {
                 key: 'nakhon_nayok',
                 th: 'นครนายก',
                 en: 'Nakhon Nayok'
             },
             {
                 key: 'nakhon_pathom',
                 th: 'นครปฐม',
                 en: 'Nakhon Pathom'
             },
             {
                 key: 'nakhon_sawan',
                 th: 'นครสวรรค์',
                 en: 'Nakhon Sawan'
             },
             {
                 key: 'nonthaburi',
                 th: 'นนทบุรี',
                 en: 'Nonthaburi'
             },
             {
                 key: 'pathum_thani',
                 th: 'ปทุมธานี',
                 en: 'Pathum Thani'
             },
             {
                 key: 'phra_nakhon_si_ayutthaya',
                 th: 'พระนครศรีอยุธยา',
                 en: 'Phra Nakhon Si Ayutthaya'
             },
             {
                 key: 'phichit',
                 th: 'พิจิตร',
                 en: 'Phichit'
             },
             {
                 key: 'phitsanulok',
                 th: 'พิษณุโลก',
                 en: 'Phitsanulok'
             },
             {
                 key: 'phetchabun',
                 th: 'เพชรบูรณ์',
                 en: 'Phetchabun'
             },
             {
                 key: 'lop_buri',
                 th: 'ลพบุรี',
                 en: 'Lop Buri'
             },
             {
                 key: 'samut_prakan',
                 th: 'สมุทรปราการ',
                 en: 'Samut Prakan'
             },
             {
                 key: 'samut_songkhram',
                 th: 'สมุทรสงคราม',
                 en: 'Samut Songkhram'
             },
             {
                 key: 'samut_sakhon',
                 th: 'สมุทรสาคร',
                 en: 'Samut Sakhon'
             },
             {
                 key: 'sing_buri',
                 th: 'สิงห์บุรี',
                 en: 'Sing Buri'
             },
             {
                 key: 'sukhothai',
                 th: 'สุโขทัย',
                 en: 'Sukhothai'
             },
             {
                 key: 'suphan_buri',
                 th: 'สุพรรณบุรี',
                 en: 'Suphan Buri'
             },
             {
                 key: 'saraburi',
                 th: 'สระบุรี',
                 en: 'Saraburi'
             },
             {
                 key: 'ang_thong',
                 th: 'อ่างทอง',
                 en: 'Ang Thong'
             },
             {
                 key: 'uthai_thani',
                 th: 'อุทัยธานี',
                 en: 'Uthai Thani'
             }
         ]
    },
    {
        key: 'east',
        th: 'ภาคตะวันออก',
        en: 'East',
        areas: [
            {
                key: 'chanthaburi',
                th: 'จันทบุรี',
                en: 'Chanthaburi'
            },
            {
                key: 'chachoengsao',
                th: 'ฉะเชิงเทรา',
                en: 'Chachoengsao'
            },
            {
                key: 'chon_buri',
                th: 'ชลบุรี',
                en: 'Chon Buri'
            },
            {
                key: 'trat',
                th: 'ตราด',
                en: 'Trat'
            },
            {
                key: 'prachin_buri',
                th: 'ปราจีนบุรี',
                en: 'Prachin Buri'
            },
            {
                key: 'rayong',
                th: 'ระยอง',
                en: 'Rayong'
            },
            {
                key: 'sa_kaeo',
                th: 'สระแก้ว',
                en: 'Sa Kaeo'
            }
        ]
    },
    {
        key: 'west',
        th: 'ภาคตะวันตก',
        en: 'West',
        areas: [
            {
                key: 'kanchanaburi',
                th: 'กาญจนบุรี',
                en: 'Kanchanaburi'
            },
            {
                key: 'tak',
                th: 'ตาก',
                en: 'Tak'
            },
            {
                key: 'prachuap_khiri_khan',
                th: 'ประจวบคีรีขันธ์',
                en: 'Prachuap Khiri Khan'
            },
            {
                key: 'phetchaburi',
                th: 'เพชรบุรี',
                en: 'Phetchaburi'
            },
            {
                key: 'ratchaburi',
                th: 'ราชบุรี',
                en: 'Ratchaburi'
            }
        ]
    },
    {
        key: 'south',
        th: 'ภาคใต้',
        en: 'South',
        areas: [
            {
                key: 'krabi',
                th: 'กระบี่',
                en: 'Krabi'
            },
            {
                key: 'chumphon',
                th: 'ชุมพร',
                en: 'Chumphon'
            },
            {
                key: 'trang',
                th: 'ตรัง',
                en: 'Trang'
            },
            {
                key: 'nakhon_si_thammarat',
                th: 'นครศรีธรรมราช',
                en: 'Nakhon Si Thammarat'
            },
            {
                key: 'narathiwat',
                th: 'นราธิวาส',
                en: 'Narathiwat'
            },
            {
                key: 'pattani',
                th: 'ปัตตานี',
                en: 'Pattani'
            },
            {
                key: 'phangnga',
                th: 'พังงา',
                en: 'Phangnga'
            },
            {
                key: 'phatthalung',
                th: 'พัทลุง',
                en: 'Phatthalung'
            },
            {
                key: 'phuket',
                th: 'ภูเก็ต',
                en: 'Phuket'
            },
            {
                key: 'yala',
                th: 'ยะลา',
                en: 'Yala'
            },
            {
                key: 'ranong',
                th: 'ระนอง',
                en: 'Ranong'
            },
            {
                key: 'songkhla',
                th: 'สงขลา',
                en: 'Songkhla'
            },
            {
                key: 'satun',
                th: 'สตูล',
                en: 'Satun'
            },
            {
                key: 'surat_thani',
                th: 'สุราษฎร์ธานี',
                en: 'Surat Thani'
            }
        ]
    }
]




