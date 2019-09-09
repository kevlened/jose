const jwt = require('../')

let env;
if (typeof global !== 'undefined' && global.isReactNativeSim) {
  env = 'react-native-sim';
} else if (typeof window !== 'undefined') {
  env = 'browser';
} else {
  env = 'node';
}

const envUnsupported = {
  'react-native-sim': {
    sign: ['ES256', 'ES384', 'ES512'],
    verify: ['ES512']
  }
};

const keys = {
  HS256: {
    shared: {alg: 'HS256', ext: true, k: 'exbIckCHFGdUfuPRwjXFXK_IqYMpFM30LoJYSHp-y4IQyO0YRDh0atzudr1S0UK1_tKn5BehGDk129N1is179g', key_ops: ['sign', 'verify'], kty: 'oct'},
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJoaSI6InRoZXJlIn0.Y3jpMDqNeKHrOdJOlX7btQCCP40tOaAhjRyM3ijg6FM',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IkhTMjU2In0.eyJoaSI6InRoZXJlIn0.xzPu2SawUonr8G4-3vtkjJ0QIhln0ed58Li1MOQRinQ'
  },
  HS384: {
    shared: {alg: 'HS384', ext: true, k: 'WV6mfck3BpEJfm_THCfew7IGIOAMqFQAuqen1LnoNAv8WfcvARPG77ei4Q_f-yi1GK8uoqkbTxDfvBwNxrE-G-1-nuagsHHluF-VpMnfNzLrXbZB-MQO3kMDUsYf7JtjbhpxxtvIdzTHzwl9j4YLvB90FoJwMMP0Y5LB2LlC8lQ', key_ops: ['sign', 'verify'], kty: 'oct'},
    token: 'eyJhbGciOiJIUzM4NCJ9.eyJoaSI6InRoZXJlIn0.6BhOCFaIHwurCFHbc-T8W3Tlux_muae04-_DYlyZeZlh8YXSntxmuw5DS2kqgX5f',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IkhTMzg0In0.eyJoaSI6InRoZXJlIn0.8DzXrF-mwSddcHzCFOeQABu7qd9EhGLSCtZdyulnNbF7fYzb53uSV__yUgYqsqKE'
  },
  HS512: {
    shared: {alg: 'HS512', ext: true, k: 'wVCi2ajYM2L_9ku0Lqq_Xj5Ui8zCkpS8ltCdILgj3UN7eM4H7KMHTBJFp9oVqgIc1JyMxly2eWLxGOxamXhukSOQlsQIqC_G5sG-z4p2uknZIn3nNjKHLQSCrh16usQ0h-N5b4nEsZURtnTx9PtAE9ef8H5ja0VvLHvz0lE1OXs', key_ops: ['sign', 'verify'], kty: 'oct'},
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJoaSI6InRoZXJlIn0.GCL6GjcC9U3GaxKlf7ejZ_MoPrhnjSrcrNC0H5KL79R_74aI4r9Ojw-98tqSJn2a5u04_HHZKvG5-NX9PXGxHg',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IkhTNTEyIn0.eyJoaSI6InRoZXJlIn0.Ri1-A0kqWz_3nk8jSoFzanO9lULiY3_-TTLJHT6DPaheGlhXQYHXrOxvv3Babq9kvtN7qCj0d4DtFSDB41bp1A'
  },
  RS256: {
    public: {alg: 'RS256', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ'},
    private: {alg: 'RS256', d: 'h-frbD68wgqd3WER0MxbuRFwUhKI2yBQKYLsUX5dPptMA0wBVscszda2eVVP4O_KlcjcRx_VO6TyzyQ_U3Tkg3GG78qCd8DJVwAT5o_rUlHkSw3jz7BnSiSnJRBYVN-CV9w-0gddOmAYoBwFAhw5a751m2qkDE9-M6j_x_jExG_yyxxdNPsdK5meY3CUljLKHimlC0X57kAyKhGuPglR5bYZX37-pTeguEhN2HhPrCNwuAu3-dwwwx0t-o6lQjpBmRKlWmYlMHnYL--WeUsSdWSxDH3kPQQfNOGrj0QoLIwBf0Yco8THtqE7utN3nKlO4gPGKQXvhnm3mB8D97wB', dp: 'rQqcRXB26UOVzsDYkqKjMWz3xKJAxv4bESrFinEp5Lcv3H-ZcniMZDLM_AhV_bqDiPq2I8m6SyezDq3QSvRd7GpuBNydONQYGjWpZa1uMnw4FkA0V9PtNvzneBVEwuvE46UMGFY7hN4eVQi5jENmFYlBvQ_bNwBlVLZiuFWQTJk', dq: 'quM9NcwJPKxrYgVMphJoUtloOUYYgl_J8wz2zqtXK3ZL8OQO4SvOBM370T4-L76doIX0Of5gn12ZeOerMwW14nBryzcgxKCN3ydz4mYTpTLPqVeFli7vrbFbBaAajxSs-diMLActblcNXF-nf-i5sgKepPtFLm7YFaa7fA3fjgk', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n:'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ', p: '1P9RmWhJF5Ojox6SXfT6mctHlidT6bQ-QJn4Q8T1Jb6LcbvqmqYscMG3V-T3_qf5SQ-ZIxCuCjF3mrm25Bxy_s3xyxgfc8Mr_b0xmjmmJ5Un-2K1kLZFqi9QeBKQQT1MURzy1k9mp4OUo8LGoRFYOqf7wsB9lU4v076WWDE9Ckk', q: 'yQrU_I31esjsa7Pf3ZWzCBdlWNrc7MdMRmEXrcTwMM-HX9H4fyQ47nfhX0mTU4INt9cHu-OAcAw_Bk4-NR5gKmF_pZMT-bN6fbE4URwjZnLvzTm4A-GICJIaQPwzTNQEWYbdCSMtBQZrIt7aLo2cvb1EfmJhcOgCaQmyc06Arpk', qi: 'gsX2O4w_BjXomeG2Ex0FyUQWiFaEKIYdFlhgcPxnWE4CGbVxxqs-Akc-xsp-TU1wffpj6Y6xcBs05VM_6-QRsFPEU6XIp6kPLbKZ4LvWUr5S8RbZd66bKDveCVdsfUTC9WbnqPUTxiqqGCa2Z0w3boaoPhA4erfncP5u0eUQmnI'},
    token: 'eyJhbGciOiJSUzI1NiJ9.eyJoaSI6InRoZXJlIn0.GUWbA_UeIspsETnSn234EJL3iGYbC9aI3VPstUWZzPz5Spo8Zxu4BCgO8Kev40fIW-5ggGUo8QTz2jJ5eqqxfbKkv5L3PPI92JULUHTjpS-EPLFh-3fUr4ci6xaRzatReoY9Csk4iJ4T9ng48-vXs7Da_-tlf-eIhZ1tNDe-OXdMYjDt6VuESKD26Om99X0NdFnDiZBaIK9g2ahT5o_ghgolfQ2myF6YZcYaulY2qqQdb5pjmGd_piT6nC0lgI0WpawBVqv-1CDV23qxSQmkUWMi7SmG98auIyrmbKVCGDJKJhEMHsetbXsZQqVMMefxCjqfoE_MWAtL327MWzYooA',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlJTMjU2In0.eyJoaSI6InRoZXJlIn0.Nr4r-eDk0lvidOc2KHo_RSSMof0fPwsn_Y4Gxzz4mkwotWCp0UmJE0e8ePoJE07zyUEHmJ2MCSsot2-4Q4H8XZUcZx3VmKWBeIvD1rghqQM94krSYS12NQblHw_GH00gHsmMV9Q2obyxzcDgsUBzRuEnSIC3C7xpdx9s7AY1oIENdXkFiwYf0d1zu-LfCIA39_4kizaFCK4CWN4ul8zxTHWL9RUFF5LtLkdN0vb8P9ivISwgnnjTfXwrL6PNSB6KvfJRa-EFJQqjGNmPCXNcC8Ly7GU65xD-KLIN7cLADhA6MdMs-pGx-DxRxqcpicZqnDZB-N7UpqKn7rAudmIjpQ'
  },
  RS384: {
    public: {alg: 'RS384', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ'},
    private: {alg: 'RS384', d: 'YSf9IFzmgUm3ykcLhjpCWth1b7egu555WQABHmREPO9XdDtWd7fhAKHLsR0tvAbDB2Kea4SWuCqx7kStydgo24HrLR-iH-hLRqEiioEYy9msO5kUo80tShVHIZP-D3_h_hYDktyMLGTho7ZI1nyHAsKJ49JR9GvNclZ2dkrGVNJHJOpsewJdNeZr5Gm7VmsHpKFSruDD3BqnpV19FvfPp_WDfT9zPAfLr_Oxr2J3S0bqWgJYSHLLSxQv3dFCJ0KlMj_LlIQJ3jVa2Bs66eMbks4erxi2vnkmUM07rvlMV7O0KwMlNDd1QI1vgd1Qe9RaPAxinogt6UXY_sjRfjhILw', dp: 'pZ-vYp5pDYlcMTRGGbkWJaCPhhSHyp1vCcFq2fDUn-ozGcSzcGrgDQ1eO8eiBmq0m0YWiZv1amat5iXwTk4syXf6kwi-OB1K4LXJaxR3TVC2eBfMKScnTsapbaid_o-gVwgvgf2k6aT1lZWh8RL9OJqG-9nC_KGEz8yOv_iUDSM', dq: 'f9qz0K-qWmuxS2anbnPpihUp4ylbwh9bWFLFgf-f5STOlsECVQI12eqhkymsikLvCtNFrXgHrLs-dkr9bEVlPRIMEdk3Nm9pT3ekEPIvicVG91DoD8ofW0QYfgfxWG77Rj4Ik058_u1IOrZrWL2_3FjpOwGnD9RdPxkO0qPiXIM', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ', p: '_qODmif1jMqXOVaN5mATmDEVpFfWPno5OnR__LT_6hWmdOElAdJTCGLlSb3jrY9LGYWa5nMARbzGejyWSQG66_CgPz8n_w9pCBsDjfQKByu2ndozz1OeVjdJ43xbBAP1A4Q0Qvsu1VFK_rdS1tlti59OwORNIEVimgDeO9j85Lc', q: 'zatu66ToLe7xzLaEwRQGmQXGQXufew8FTsDHmNSZOVrT5IaNGsPnHiU7v9oyLi5eWlwu-xc2ZuF88keLEfhOSLJcWwt5ZzZFEybvv36CvHmuIOM1_9NBY7k4VU8QBO2rPfIUqAR5z2RP89OTSdulmtONsDQxJaQ0EzeXKZ7mS9s', qi: 'zznzwWLNW6pA3_0EY-PSUB-N1QOoE8xJ63PAwXdyJPokWNatkP80EC-Lx6qRfNxWsufNSBllKo9zaT0AhNX7wzQvzs5dBCBjLQFrtOyXmfWgNQ9mjQbs2x9N5668u5Vkr8rF7X8XTvRwkLy_lVN9aV9nOsFYsbgQKWtSHMNIneo'},
    token: 'eyJhbGciOiJSUzM4NCJ9.eyJoaSI6InRoZXJlIn0.Xe9ZBqsjRX8uBwaAREFMEQQKr5hBpxvRuTCg1cvU7i59U4GYV5mpsbDkbP8RELwpyR8L3E6ukCsMMxlGCg9wV91WC5-s1-GD_YSy4UKbbyIkrPO5iR6sutjf8HZbOgC99WnF1VA8XXpnSHOjVyx8JrUcNP_y-EBbK4cW-x47PD4htYPX1JNlh41ettZXINPnoh7VBhEdIjJVqwofOW597bYBOTzhjXDLSE5egHdOBoacrIE1jXeq0WWEriFnRvEzxGpDXI5BRqQQ8I6crh7zc94322VIU4G3JKJDWFliXYmf_g3XqhKqmzSdW0qK9P7eCe2mSWS0YT9G-jmw8aQ-5w',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlJTMzg0In0.eyJoaSI6InRoZXJlIn0.PqqaxYEoI3gpzsgU8r_aVEgd7I_vxIa7JYjbWVWqdXol6aSCRCDTkn4LEzlzDUbno9JBzE85w4zfncBhoFeEvM8twAFH6KNgCZnjXUgVeU-_B8lXQOXt-GRXB01sQa8R61e7utscUCZll65S_adOY29xDScc7Q-gCaQjt4VoK3xP4WC_jtc7oPtnviWrxuxiJLe95VooPNZN7q4-zvddYpRTBOOq9Iwl1NuIFlS03TVxmd_hPjY1Np0--GKf5hTRVql_wgZRRklcmqYMrv0kykUCdcFABk-lPVAVMlFp6Moqy2sk1eCizOu5ElWE2LRUSxX5WLq6twlzPDtOHNXEDA'
  },
  RS512: {
    public: {alg: 'RS512', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q'},
    private: {alg: 'RS512', d: 'BhwuVyI6w39F8IdQWDMqgz1NF8dnf3CHRFGHOpdxbDwUofIbj9QeZqZJ9olX9Ke0FVqOROMIjN95n1Nu4TiZGvVshet9n2m28-UG2fCp5-hWFSamcljCk9WCff0I6Dm3Ukz_QKofUvg4SL-UIt1glSM-0CTX-LaCS9V0_mEIyGXJdnB_2NiwUPg0Qmsb_N8Q48hGf8Q98Do8XVEtOznPkr5yZPrB_ggcC1BCBWtj5rpe5dsomMS81IyS86vcr1V-EZayrYG83A6uCvDM2TUhWLkq1ojRBaripbnsD6hnmSiwuj92E-26rb7t86X6mLMgJj-gVYAbRFqeHiQjh3nPEQ', dp: 'FQnLzNrI20WSuPK4fWhrMJbP3ZlrgEjLaSKtyWSnU2o2bHqBH6AgKCyeFF6-BhC7iFPSDplVHWmg4mAhbKe2zUhQ24_Gedc_s-ZsdRW9ciB5JH4Tocl3V0ZcABzHrv-KQoWJZwt38txW3sAjLN-KLqh07fTPCBjPYuN7INRbzcU', dq: 'B9RfbOl729Q0fTkwI9Xsch5_mpQGCUl8e518hLwFbTlW6aCb4W4k7lku_6Iv1rl3aiZWlXqFl1Y43U8vlJbAMmzNHfE4nz9wWZmB4hwUalhcJBMgdWET-FbtTNUWYnJNwZsj2TNShzP86plSgUy19dPxOXvUtKVk3UTy_AqFG1E', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q', p: '8BS4fAlZHCWIYZi8psE4E7Pia3xISgJkvRhslyHdgFBRmtqVPwqk2v3qjvKC0m61eLpBdM52mvq1bK1NdqrhVODCKukLhy_PSPn_iEcT62b7inZ9Ev5mpaGOQ1g08kfSzXx_VcIsO-xJEGeAjsOlhP-racRmvlUd_Hj64znBEH0', q: 'wxr80Mgz6Wx3R_--TIOhAHs0FWDQboeq1rm8FEyGDxCPkifcYMG9FEHujwIXD4GrFWPwzCEBJ4BPxZoTchzjfzibOtNHffY6HWHfQcwSiSDAxbhpLLsFZO4N_kkfTC-FWEadVP44s7ynSNUVeZi_zyBrNgc4sodAsoAfPqNAOjk', qi: 'lBbhr6TY1bYKQZg90IN-FuMgQgquCisLt5cOL7Ut8XYcaIdV_QCy9ajHHrF4MBnc-L2DdO1uhGd8ex6DY_4U5wWhWyFDuzscwBFXXRDUPTu-VmulCQ-iIwKjpNMO1XSVtJnwIRC0hb4NH_Y0hLSurxW4IHaqcSnpwHW3RPyb-QA'},
    token: 'eyJhbGciOiJSUzUxMiJ9.eyJoaSI6InRoZXJlIn0.D0uoqQcKJKtUQ9buC6k8-fB9dD_QCJ4uUSwVXyXhsVP9TXRcsYRy_ZGpj8fjL441f6AyPu1S38LZ9Zwwyh_zg_XOgzNsy37UmWvC--QNAjkJv7UR93pFLAwUULFx9erFi914e1v_qFz7xW_Fo8dzMCnzaquk_7xZ1-2KWjzur3F0PWAi55iW00Ptdon2MvVG41fVc3ka3_BSjZYT3VsL95weBV3pwXDE11UfiKnJ3fAGJ2AqnSEh3_XdBTMFx_1HaFtFRhEBW-B2uJmpYJIHe90QiQ6tpGoZsWus9IE4Sd4SQI6JUaahsvNFbXeBkKRlqAFqQM79dvF_NSq4IpbzQQ',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlJTNTEyIn0.eyJoaSI6InRoZXJlIn0.OdGluyrM7aWs-gnPz3TLye2yIMf0NJt1XkfFCsssGT4MbWMBfdVp56zHUTzFRdGrEMXu8pKeTVuA-I8c-NrgRtyJhFxj1Ui6e1DHzdPIPLkCcLkAls9ZqzgvP6AA7v4cOzCYn3jk5EchF_bNJhC7BXFDd291Lx3m0k4RAe-wtX0n9Kae6IBegfItZ743ey_3hpS2oi_1rIyi0ojLw-C2Mgj3bqdJuAjfPTkIMCXDRU4Vl6rhKO_SRcUB6jzTbvVfJ4A3x6iB2CVFusl6_svmTSbr4pKFd3y-92B6QzUiLr9Y3EeUlO9IKRJqBJMZb_Onmlb5A91b7z5_t4NBNhIAcQ'
  },
  PS256: {
    public: {alg: 'PS256', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ'},
    private: {alg: 'PS256', d: 'h-frbD68wgqd3WER0MxbuRFwUhKI2yBQKYLsUX5dPptMA0wBVscszda2eVVP4O_KlcjcRx_VO6TyzyQ_U3Tkg3GG78qCd8DJVwAT5o_rUlHkSw3jz7BnSiSnJRBYVN-CV9w-0gddOmAYoBwFAhw5a751m2qkDE9-M6j_x_jExG_yyxxdNPsdK5meY3CUljLKHimlC0X57kAyKhGuPglR5bYZX37-pTeguEhN2HhPrCNwuAu3-dwwwx0t-o6lQjpBmRKlWmYlMHnYL--WeUsSdWSxDH3kPQQfNOGrj0QoLIwBf0Yco8THtqE7utN3nKlO4gPGKQXvhnm3mB8D97wB', dp: 'rQqcRXB26UOVzsDYkqKjMWz3xKJAxv4bESrFinEp5Lcv3H-ZcniMZDLM_AhV_bqDiPq2I8m6SyezDq3QSvRd7GpuBNydONQYGjWpZa1uMnw4FkA0V9PtNvzneBVEwuvE46UMGFY7hN4eVQi5jENmFYlBvQ_bNwBlVLZiuFWQTJk', dq: 'quM9NcwJPKxrYgVMphJoUtloOUYYgl_J8wz2zqtXK3ZL8OQO4SvOBM370T4-L76doIX0Of5gn12ZeOerMwW14nBryzcgxKCN3ydz4mYTpTLPqVeFli7vrbFbBaAajxSs-diMLActblcNXF-nf-i5sgKepPtFLm7YFaa7fA3fjgk', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n:'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ', p: '1P9RmWhJF5Ojox6SXfT6mctHlidT6bQ-QJn4Q8T1Jb6LcbvqmqYscMG3V-T3_qf5SQ-ZIxCuCjF3mrm25Bxy_s3xyxgfc8Mr_b0xmjmmJ5Un-2K1kLZFqi9QeBKQQT1MURzy1k9mp4OUo8LGoRFYOqf7wsB9lU4v076WWDE9Ckk', q: 'yQrU_I31esjsa7Pf3ZWzCBdlWNrc7MdMRmEXrcTwMM-HX9H4fyQ47nfhX0mTU4INt9cHu-OAcAw_Bk4-NR5gKmF_pZMT-bN6fbE4URwjZnLvzTm4A-GICJIaQPwzTNQEWYbdCSMtBQZrIt7aLo2cvb1EfmJhcOgCaQmyc06Arpk', qi: 'gsX2O4w_BjXomeG2Ex0FyUQWiFaEKIYdFlhgcPxnWE4CGbVxxqs-Akc-xsp-TU1wffpj6Y6xcBs05VM_6-QRsFPEU6XIp6kPLbKZ4LvWUr5S8RbZd66bKDveCVdsfUTC9WbnqPUTxiqqGCa2Z0w3boaoPhA4erfncP5u0eUQmnI'},
    token: 'eyJhbGciOiJQUzI1NiJ9.eyJoaSI6InRoZXJlIn0.dUaLgIHIBFwT6d2vXqXeNq5dH0jXmvtVeDgijFQohUzpl66X-Cfa3LkkHQ1yyE6h1ib2_ZrYt5QK1LXyE67-w8LUcAnuU8aamU86__v9mQYax4nWq449F2mxp230s8RmUyd8nyMP04-rQkRgA97cvn5pEccXrVUUKi45qnlgudJmrH3KR8hIoUr6CskuV9ZwN1-1P_tSebLfH_VtPc1RceBfaSLj-JH0iZk9AgJwjYnSD0w90WXaTak9JhuoV8lNUM8qmcvY2Xe7aR2Q9VXyunF8kcXxBDkfoB7ZRgh2PiUJFxszkYWxj_xFh-4QE-PWKWqDeil2iWI9II0PT7c4Ow',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlBTMjU2In0.eyJoaSI6InRoZXJlIn0.AfMB6WbzIAFMFUd7aoeO-OLD0NFAuC8sfBwgVuJ-QrVUzVe6Xowm3Zh4y7f7F6MAx5_NXPRNsboDNQEgY_ODQmEsirGZg22gsceMkHMjNZ1nWmkGjhjw2RSauq0sCCNr2o6nkpgbd3yb9AZ1C3JD_b6ERYLmqmvl1HyBf3DbKC8EXaJo4MKjz9Bdw-iLaQOZSheYmdO8aUmTF8MBhOTyQEcnRkY47lKiQCpKkH3vUpUGLoc0QYa8P8xybv4LbxYrNTY2ylGrdkwUNzo1p2ZBoZBX5AeoQWMBvbFi5L8pQB9ttr-kt9LYe_jjYIsv9dor6rw_pdaQ2rGKRVFdhFFalA'
  },
  PS384: {
    public: {alg: 'PS384', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ'},
    private: {alg: 'PS384', d: 'YSf9IFzmgUm3ykcLhjpCWth1b7egu555WQABHmREPO9XdDtWd7fhAKHLsR0tvAbDB2Kea4SWuCqx7kStydgo24HrLR-iH-hLRqEiioEYy9msO5kUo80tShVHIZP-D3_h_hYDktyMLGTho7ZI1nyHAsKJ49JR9GvNclZ2dkrGVNJHJOpsewJdNeZr5Gm7VmsHpKFSruDD3BqnpV19FvfPp_WDfT9zPAfLr_Oxr2J3S0bqWgJYSHLLSxQv3dFCJ0KlMj_LlIQJ3jVa2Bs66eMbks4erxi2vnkmUM07rvlMV7O0KwMlNDd1QI1vgd1Qe9RaPAxinogt6UXY_sjRfjhILw', dp: 'pZ-vYp5pDYlcMTRGGbkWJaCPhhSHyp1vCcFq2fDUn-ozGcSzcGrgDQ1eO8eiBmq0m0YWiZv1amat5iXwTk4syXf6kwi-OB1K4LXJaxR3TVC2eBfMKScnTsapbaid_o-gVwgvgf2k6aT1lZWh8RL9OJqG-9nC_KGEz8yOv_iUDSM', dq: 'f9qz0K-qWmuxS2anbnPpihUp4ylbwh9bWFLFgf-f5STOlsECVQI12eqhkymsikLvCtNFrXgHrLs-dkr9bEVlPRIMEdk3Nm9pT3ekEPIvicVG91DoD8ofW0QYfgfxWG77Rj4Ik058_u1IOrZrWL2_3FjpOwGnD9RdPxkO0qPiXIM', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ', p: '_qODmif1jMqXOVaN5mATmDEVpFfWPno5OnR__LT_6hWmdOElAdJTCGLlSb3jrY9LGYWa5nMARbzGejyWSQG66_CgPz8n_w9pCBsDjfQKByu2ndozz1OeVjdJ43xbBAP1A4Q0Qvsu1VFK_rdS1tlti59OwORNIEVimgDeO9j85Lc', q: 'zatu66ToLe7xzLaEwRQGmQXGQXufew8FTsDHmNSZOVrT5IaNGsPnHiU7v9oyLi5eWlwu-xc2ZuF88keLEfhOSLJcWwt5ZzZFEybvv36CvHmuIOM1_9NBY7k4VU8QBO2rPfIUqAR5z2RP89OTSdulmtONsDQxJaQ0EzeXKZ7mS9s', qi: 'zznzwWLNW6pA3_0EY-PSUB-N1QOoE8xJ63PAwXdyJPokWNatkP80EC-Lx6qRfNxWsufNSBllKo9zaT0AhNX7wzQvzs5dBCBjLQFrtOyXmfWgNQ9mjQbs2x9N5668u5Vkr8rF7X8XTvRwkLy_lVN9aV9nOsFYsbgQKWtSHMNIneo'},
    token: 'eyJhbGciOiJQUzM4NCJ9.eyJoaSI6InRoZXJlIn0.scgwDVRHWsUo4D_L5pStJXtnpSDVk7UfT1-JTxAv-_4tQCL9ZZ1O98aoA6t2w3WdthadDmsUlwSEjcLDqUhCuXuSkMPrWnI4h6PLuVGEYy4zwRDHyVGRA6LyIWUfRs3LV2Oe5H2ke9VUAQwySwnQhTVVQsWeC2P_dVXFVkxAE9eWDprnbMWLTSxbZRGTDXjCe3FSuzbOvvz6RZ1JZCkI9XJegF7jl3K1ECocxHo17DWtlI6uo2Lm_Sdg6_oZ4DiQXStzGdujaLRXLKtLcEgaj8gy7VDFTX2BF3qR8wsFnIohqBnyOluWJjosozENlfsi4muR2RgQkD_uySeA1NALvQ',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlBTMzg0In0.eyJoaSI6InRoZXJlIn0.BcBP1bfHTG7WVVCOA4HGG39s1CvJe8jXg1RIkBhVEOI8KEWJrp9RqnVUU-oI-saBrTmRp1ihQeee_G6WuEoHWIDEyWgoaGfuaKeXFGoYfHJ3zztmndMagrWaEngwDbeAnf_kQsKovtRYN4t3yHqC1YZgH3LCjmMIGEwkFXKQs54fHVDmKeyyvyTMsyUDJdz4SWXGlcGT7baKDlhuMHn76nvM4h1fZ8d7-w0CjsyRMGKO-U27wpz6BrlIqZpAptcfMhf2SJsmV3Ef48QaHQd9bR7omiDECIdEJfNeIe3zKi3spxBWX3dTb6vpr_BSUzk82n_oUgN3yKBokfmkL70ZDw'
  },
  PS512: {
    public: {alg: 'PS512', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q'},
    private: {alg: 'PS512', d: 'BhwuVyI6w39F8IdQWDMqgz1NF8dnf3CHRFGHOpdxbDwUofIbj9QeZqZJ9olX9Ke0FVqOROMIjN95n1Nu4TiZGvVshet9n2m28-UG2fCp5-hWFSamcljCk9WCff0I6Dm3Ukz_QKofUvg4SL-UIt1glSM-0CTX-LaCS9V0_mEIyGXJdnB_2NiwUPg0Qmsb_N8Q48hGf8Q98Do8XVEtOznPkr5yZPrB_ggcC1BCBWtj5rpe5dsomMS81IyS86vcr1V-EZayrYG83A6uCvDM2TUhWLkq1ojRBaripbnsD6hnmSiwuj92E-26rb7t86X6mLMgJj-gVYAbRFqeHiQjh3nPEQ', dp: 'FQnLzNrI20WSuPK4fWhrMJbP3ZlrgEjLaSKtyWSnU2o2bHqBH6AgKCyeFF6-BhC7iFPSDplVHWmg4mAhbKe2zUhQ24_Gedc_s-ZsdRW9ciB5JH4Tocl3V0ZcABzHrv-KQoWJZwt38txW3sAjLN-KLqh07fTPCBjPYuN7INRbzcU', dq: 'B9RfbOl729Q0fTkwI9Xsch5_mpQGCUl8e518hLwFbTlW6aCb4W4k7lku_6Iv1rl3aiZWlXqFl1Y43U8vlJbAMmzNHfE4nz9wWZmB4hwUalhcJBMgdWET-FbtTNUWYnJNwZsj2TNShzP86plSgUy19dPxOXvUtKVk3UTy_AqFG1E', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q', p: '8BS4fAlZHCWIYZi8psE4E7Pia3xISgJkvRhslyHdgFBRmtqVPwqk2v3qjvKC0m61eLpBdM52mvq1bK1NdqrhVODCKukLhy_PSPn_iEcT62b7inZ9Ev5mpaGOQ1g08kfSzXx_VcIsO-xJEGeAjsOlhP-racRmvlUd_Hj64znBEH0', q: 'wxr80Mgz6Wx3R_--TIOhAHs0FWDQboeq1rm8FEyGDxCPkifcYMG9FEHujwIXD4GrFWPwzCEBJ4BPxZoTchzjfzibOtNHffY6HWHfQcwSiSDAxbhpLLsFZO4N_kkfTC-FWEadVP44s7ynSNUVeZi_zyBrNgc4sodAsoAfPqNAOjk', qi: 'lBbhr6TY1bYKQZg90IN-FuMgQgquCisLt5cOL7Ut8XYcaIdV_QCy9ajHHrF4MBnc-L2DdO1uhGd8ex6DY_4U5wWhWyFDuzscwBFXXRDUPTu-VmulCQ-iIwKjpNMO1XSVtJnwIRC0hb4NH_Y0hLSurxW4IHaqcSnpwHW3RPyb-QA'},
    token: 'eyJhbGciOiJQUzUxMiJ9.eyJoaSI6InRoZXJlIn0.jAKFIZ6OKCLmHa29pCmP9DFJfD0l4jmypcicA8HM4hTBTn_F1UrOpY1fWI3SKtH3U6MLIEtZ9TC8rIU_UAZ1hJ0Sw8VKxm-6gbR1XlE_6tz1lpymEGcPHwJQ8r0n8bblarqWyqZwMnYgthIc9OAqVuEf6yvi4VfS_03YwIQ0-TF3ecPgycLiFUW1exeU8dHxXPIJy-sfWryqNXV8v6wEjNMivojUMIww9Lrttpmc5nIk3rOK66fv1HG9lfL_H5TtzwnnJ05vVILMsrd4pKQA71cAIo4fhCUnMpEolW4ow0-wqPzs_Hx_2Pe2WAI9nAYVgpRkAqlYWH3TnNcRu7wXHw',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlBTNTEyIn0.eyJoaSI6InRoZXJlIn0.g5oTtm6TAc4fRlWaYN4lkTHzmtEl5HI2brQMFDZzLS5MKq5_a-ygGUaqguCf9oxIlaS5vjIp9bGtJBovsXP3ucxssus0_gV_vAKWb4o5lspToyVC0m3IdlaqLV1MAzgHWIPH-lReeL9OulnwcHkjx7AbWBsbrYZh-Q4UmL7IqOzN2DhFMXWUEBmX5-_vhvjSLeb43zOshmlejhI4IlUGlcK3TO6ZYW708laXqX2G7Edth48o2ywwxyo9cpT4bhceIMU6iSeomymTOt77qUqx6nX5Vu4S87-7qcZOP8bhE8cANcCmCU3j_Yj53cCrbxVRX_Ae0PwNW58XEH95ycpcLA'
  },
  ES256: {
    public: {crv: 'P-256', ext: true, key_ops: ['verify'], kty: 'EC', x: '8B6DdEcf9LgGjkl07sjBmm43r_f_46chavGDCXdwTs4', y: 'ny6GcIxI8agD7zCZFfzMdh7PezRsU9UTra2BODJEE40'},
    private: {crv: 'P-256', d: 'cpNptDUu2vtVu3Hg21lQBP2fq1F7cetbijs2Q_Z7p7g', ext: true, key_ops: ['sign'], kty: 'EC', x: '8B6DdEcf9LgGjkl07sjBmm43r_f_46chavGDCXdwTs4', y: 'ny6GcIxI8agD7zCZFfzMdh7PezRsU9UTra2BODJEE40'},
    token: 'eyJhbGciOiJFUzI1NiJ9.eyJoaSI6InRoZXJlIn0.eaHOnJnMdK5BWq-FQ5Fm1D-zb8Fx3657qMpC2PsC5Azs-lMYh9wp1JlB3NRofVNzH-1rNcVxov3Sx6f9RiSDAg'
  },
  ES384: {
    public: {crv: 'P-384', ext: true, key_ops: ['verify'], kty: 'EC', x: 'HkpD9lbkJQL8DRIqqOTFG-VMUX-asvxcGZ1XLpN5FM-VRHwtH0rCSGi1THHWk4x9', y: 'fG-hS1QebrLApgwFd7bCVIIAF1L3SNMrL_RKADi8JcHZkgKtSHjr8-ft7HG1lcuy'},
    private: {crv: 'P-384', d: 'KzEPTqZXwNAx5OIgRiUa-iw5dUnEe-i-fXemiyhCgNA8kpHQ64GPaVlsI4ZYeLrP', ext: true, key_ops: ['sign'], kty: 'EC', x: 'HkpD9lbkJQL8DRIqqOTFG-VMUX-asvxcGZ1XLpN5FM-VRHwtH0rCSGi1THHWk4x9', y: 'fG-hS1QebrLApgwFd7bCVIIAF1L3SNMrL_RKADi8JcHZkgKtSHjr8-ft7HG1lcuy'},
    token: 'eyJhbGciOiJFUzM4NCJ9.eyJoaSI6InRoZXJlIn0.XoTjWfmACAHqxxLg-ivLWI1N44fFaUT-iJZ4wTXoIWn0FDx2-LVv9bf9jqg014Hz738TFukL6uHK8OhN4m250CgCHrC3vE3_p7h0VPP1NAG143UXQTME0226kzRTeaqu'
  },
  ES512: {
    public: {crv: 'P-521', ext: true, key_ops: ['verify'], kty: 'EC', x: 'AYCWh_Ke7CTWDY3ssog9SD8Ugjs7j_uUaZWcB1tR8upMkpd2peH4gp5BjtXYDEZrHQCF02YNWmuskyJttL6ZDp09', y: 'AfXjzgorxGOQFuGigV9Igm-5sqRiAJZWXzCHEjJjNj_SEtxC3N4iETCoUOhLys9nkV-t3Xog-1xYPIoQ0qUJ5157'},
    private: {crv: 'P-521', d: 'AT4boQwA47hWCiv0_220NwtyhJ5fRuSwukZh--SdNlh7YDUekEHoUbdI3s6Ss2hxnWMlF83r0cKLr5beQ7rjmCdb', ext: true, key_ops: ['sign'], kty: 'EC', x: 'AYCWh_Ke7CTWDY3ssog9SD8Ugjs7j_uUaZWcB1tR8upMkpd2peH4gp5BjtXYDEZrHQCF02YNWmuskyJttL6ZDp09', y: 'AfXjzgorxGOQFuGigV9Igm-5sqRiAJZWXzCHEjJjNj_SEtxC3N4iETCoUOhLys9nkV-t3Xog-1xYPIoQ0qUJ5157'},
    token: 'eyJhbGciOiJFUzUxMiJ9.eyJoaSI6InRoZXJlIn0.AZA_oYU8q23GLxt_1D2ahZNAIlgB_cI4Rvb3zOVquZgIZ91kJzTxrWlkaLhPXY0ROeioYbUHo7smBsg6hxyw11GrAf26LpkZFLy53sjTl6M7AWtKqs0RnZkXoXm8Uu7yR_BTCuNIsFInMGKaMCkXVn9gEwC5zyFK0DZTI50urCvFWNNG'
  }
}

const payload = {hi:"there"};

function supports(options) {
  for (let method in options) {
    alg = options[method];

    if (
      envUnsupported[env] &&
      envUnsupported[env][method] &&
      envUnsupported[env][method].includes(alg)
    ) {
      return {
        it(description) {
          return xit(`unsupported in ${env}: ${description}`);
        }
      }
    }
  }

  return { it, xit, fit };
}

describe('sign', () => {
  // 'PS256', 'PS384', 'PS512' have to be tested differently since signing is probabilistic and therefore cannot be verified via a simple compare
  ['PS256', 'PS384', 'PS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo}`, () =>
      jwt.sign(payload, keys[algo].private)
      .then(res => expect(res).toEqual(jasmine.any(String)))
    );
  });

  ['RS256', 'RS384', 'RS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo}`, () =>
      jwt.sign(payload, keys[algo].private)
      .then(res => expect(res).toEqual(keys[algo].token))
    );
  });

  ['HS256', 'HS384', 'HS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo}`, () =>
      jwt.sign(payload, keys[algo].shared)
      .then(res => expect(res).toEqual(keys[algo].token))
    )
  });

  ['ES256', 'ES384', 'ES512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo}`, () =>
      jwt.sign(payload, keys[algo].private, { alg: algo })
      .then(res => expect(res).toBeDefined())
    )
  });

  ['RS256', 'RS384', 'RS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo} and headers`, () =>
      jwt.sign(payload, keys[algo].private, { kid: 'id' })
      .then(res => expect(res).toEqual(keys[algo].withKid))
    );
  });

  ['HS256', 'HS384', 'HS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo} and custom header`, () =>
      jwt.sign(payload, keys[algo].shared, { kid: 'id' })
      .then(res => expect(res).toEqual(keys[algo].withKid))
    )
  });

  ['ES256', 'ES384', 'ES512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo} and custom header`, () =>
      jwt.sign(payload, keys[algo].private, { alg: algo, kid: 'id' })
      .then(res => {
        expect(res).toBeDefined();
        return jwt.decode(res);
      })
      .then(decoded => expect(decoded.header).toEqual({ alg: algo, kid: 'id' }))
    )
  });
})

describe('verify', () => {
  ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'].map(algo => {
    supports({ importKey: algo, verify: algo }).it(`verifies with ${algo}`, () =>
      jwt.verify(keys[algo].token, keys[algo].public)
      .then(res => expect(res).toEqual(payload))
    );
  });

  ['HS256', 'HS384', 'HS512'].map(algo => {
    supports({ importKey: algo, verify: algo }).it(`verifies with ${algo}`, () =>
      jwt.verify(keys[algo].token, keys[algo].shared)
      .then(res => expect(res).toEqual(payload))
    )
  });

  ['ES256', 'ES384', 'ES512'].map(algo => {
    supports({ importKey: algo, verify: algo }).it(`verifies with ${algo}`, () =>
      jwt.verify(keys[algo].token, keys[algo].public)
      .then(res => expect(res).toEqual(payload))
    )
  });
})
