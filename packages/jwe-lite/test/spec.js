const jwe = require('../')

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
    token: 'eyJhbGciOiJIUzI1NiJ9.YQ.C5loZx9V9J2WsloSC9V-AfAhWt8LGPAHV8uyJ438yDg',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IkhTMjU2In0.YQ._JZ4Bz4JU4RJ2Knx3zCM-2SP88gNYS2Px9ADxhe5rnU'
  },
  HS384: {
    shared: {alg: 'HS384', ext: true, k: 'WV6mfck3BpEJfm_THCfew7IGIOAMqFQAuqen1LnoNAv8WfcvARPG77ei4Q_f-yi1GK8uoqkbTxDfvBwNxrE-G-1-nuagsHHluF-VpMnfNzLrXbZB-MQO3kMDUsYf7JtjbhpxxtvIdzTHzwl9j4YLvB90FoJwMMP0Y5LB2LlC8lQ', key_ops: ['sign', 'verify'], kty: 'oct'},
    token: 'eyJhbGciOiJIUzM4NCJ9.YQ.Ez4eCLq1TYEPnqDQfoJYv6abqQipSPUXABn1V_dZ5Hm1khE4G8k5PqPqc-yH7sJ9',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IkhTMzg0In0.YQ.Qkc4jwwnuVEWepTQlqFqpDxeyJbOxN_q4cQm6aXHYz4lD4Nt1kicv27M4uOXPUJP'
  },
  HS512: {
    shared: {alg: 'HS512', ext: true, k: 'wVCi2ajYM2L_9ku0Lqq_Xj5Ui8zCkpS8ltCdILgj3UN7eM4H7KMHTBJFp9oVqgIc1JyMxly2eWLxGOxamXhukSOQlsQIqC_G5sG-z4p2uknZIn3nNjKHLQSCrh16usQ0h-N5b4nEsZURtnTx9PtAE9ef8H5ja0VvLHvz0lE1OXs', key_ops: ['sign', 'verify'], kty: 'oct'},
    token: 'eyJhbGciOiJIUzUxMiJ9.YQ.MPDdToIKsWwIFFXOf8Yuj5ZyLHYnUHhesgxgVcmR8-5ZOVU-KhblW_MAFPtJ9dnjXvTal316fRFSY6YsIn5dyA',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IkhTNTEyIn0.YQ.zKJKxt-xGHw0HAXHCtZKJOEWG3rUCX0AV6a2-e69GZteSlXO1MyiLhd_dQjplCC2u28415fUlK4-rzvcNsOTbw'
  },
  PS256: {
    public: {alg: 'PS256', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ'},
    private: {alg: 'PS256', d: 'h-frbD68wgqd3WER0MxbuRFwUhKI2yBQKYLsUX5dPptMA0wBVscszda2eVVP4O_KlcjcRx_VO6TyzyQ_U3Tkg3GG78qCd8DJVwAT5o_rUlHkSw3jz7BnSiSnJRBYVN-CV9w-0gddOmAYoBwFAhw5a751m2qkDE9-M6j_x_jExG_yyxxdNPsdK5meY3CUljLKHimlC0X57kAyKhGuPglR5bYZX37-pTeguEhN2HhPrCNwuAu3-dwwwx0t-o6lQjpBmRKlWmYlMHnYL--WeUsSdWSxDH3kPQQfNOGrj0QoLIwBf0Yco8THtqE7utN3nKlO4gPGKQXvhnm3mB8D97wB', dp: 'rQqcRXB26UOVzsDYkqKjMWz3xKJAxv4bESrFinEp5Lcv3H-ZcniMZDLM_AhV_bqDiPq2I8m6SyezDq3QSvRd7GpuBNydONQYGjWpZa1uMnw4FkA0V9PtNvzneBVEwuvE46UMGFY7hN4eVQi5jENmFYlBvQ_bNwBlVLZiuFWQTJk', dq: 'quM9NcwJPKxrYgVMphJoUtloOUYYgl_J8wz2zqtXK3ZL8OQO4SvOBM370T4-L76doIX0Of5gn12ZeOerMwW14nBryzcgxKCN3ydz4mYTpTLPqVeFli7vrbFbBaAajxSs-diMLActblcNXF-nf-i5sgKepPtFLm7YFaa7fA3fjgk', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n:'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ', p: '1P9RmWhJF5Ojox6SXfT6mctHlidT6bQ-QJn4Q8T1Jb6LcbvqmqYscMG3V-T3_qf5SQ-ZIxCuCjF3mrm25Bxy_s3xyxgfc8Mr_b0xmjmmJ5Un-2K1kLZFqi9QeBKQQT1MURzy1k9mp4OUo8LGoRFYOqf7wsB9lU4v076WWDE9Ckk', q: 'yQrU_I31esjsa7Pf3ZWzCBdlWNrc7MdMRmEXrcTwMM-HX9H4fyQ47nfhX0mTU4INt9cHu-OAcAw_Bk4-NR5gKmF_pZMT-bN6fbE4URwjZnLvzTm4A-GICJIaQPwzTNQEWYbdCSMtBQZrIt7aLo2cvb1EfmJhcOgCaQmyc06Arpk', qi: 'gsX2O4w_BjXomeG2Ex0FyUQWiFaEKIYdFlhgcPxnWE4CGbVxxqs-Akc-xsp-TU1wffpj6Y6xcBs05VM_6-QRsFPEU6XIp6kPLbKZ4LvWUr5S8RbZd66bKDveCVdsfUTC9WbnqPUTxiqqGCa2Z0w3boaoPhA4erfncP5u0eUQmnI'},
    token: 'eyJhbGciOiJQUzI1NiJ9.YQ.mWgFUcO7b-iB9uXqXuHfDISjgkqz4qX8SDBni-lq3hoDDx6_Ixrt_z7joVPEAQSbMZGB6dPLB7E8Mk_P-VTuS2vS4x2IhI9DJ-TgmSR4_m8Sq_N1nhKkYFZ6MsQ5M0zV4WvL8NuUor1ApWVke1rbQvlKmaUnXn6NfMLBf_AICDVha-3iOYn3sLmN3H0rm7m9ltwqUT9TnG7fCNQPCjVBY5kUbkjE_bY4dEFiuY15n0Kl95v9UU8_lTtTBzVe5MXvrcKP1IeRsIzn6kel_QuXByL5IxJowmhvThHS9qQDpfuT3Ep6IZZdIyPuPhr-9l2mYvo2irTelNjiTCI_oILoTQ',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlBTMjU2In0.YQ.TjxUWqLu_vv9Ca5JsoRa9hT7oTqHfFfjKIOFBbyzMYcZVvf1cJuQjFtWegqIlItBevFf4m1O_k1zYsdTMFEQmfJQSsyo5PETNvHrGWh4CdgXUzRBzcjzugTRMh_AY5WIS6cgYZQIamotZDrVHrDx629ps2XDrrO9-yKg4r8b7GaIa5rcQvL2Amz_GQS2SqvvyPAAOKQom0g8K592wb3zmxejSZwLcQWtn-3tMIBf118lzfIGJtRaoNE5TM2tPSvYoSpEybxgjFwjszeg1rPjq1sL8yjEEJhrLHrHqIECwyTRo5BQO_UqBtvj1prEE8p5-xp34iC06BYf080W3hoi4g'
  },
  PS384: {
    public: {alg: 'PS384', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ'},
    private: {alg: 'PS384', d: 'YSf9IFzmgUm3ykcLhjpCWth1b7egu555WQABHmREPO9XdDtWd7fhAKHLsR0tvAbDB2Kea4SWuCqx7kStydgo24HrLR-iH-hLRqEiioEYy9msO5kUo80tShVHIZP-D3_h_hYDktyMLGTho7ZI1nyHAsKJ49JR9GvNclZ2dkrGVNJHJOpsewJdNeZr5Gm7VmsHpKFSruDD3BqnpV19FvfPp_WDfT9zPAfLr_Oxr2J3S0bqWgJYSHLLSxQv3dFCJ0KlMj_LlIQJ3jVa2Bs66eMbks4erxi2vnkmUM07rvlMV7O0KwMlNDd1QI1vgd1Qe9RaPAxinogt6UXY_sjRfjhILw', dp: 'pZ-vYp5pDYlcMTRGGbkWJaCPhhSHyp1vCcFq2fDUn-ozGcSzcGrgDQ1eO8eiBmq0m0YWiZv1amat5iXwTk4syXf6kwi-OB1K4LXJaxR3TVC2eBfMKScnTsapbaid_o-gVwgvgf2k6aT1lZWh8RL9OJqG-9nC_KGEz8yOv_iUDSM', dq: 'f9qz0K-qWmuxS2anbnPpihUp4ylbwh9bWFLFgf-f5STOlsECVQI12eqhkymsikLvCtNFrXgHrLs-dkr9bEVlPRIMEdk3Nm9pT3ekEPIvicVG91DoD8ofW0QYfgfxWG77Rj4Ik058_u1IOrZrWL2_3FjpOwGnD9RdPxkO0qPiXIM', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ', p: '_qODmif1jMqXOVaN5mATmDEVpFfWPno5OnR__LT_6hWmdOElAdJTCGLlSb3jrY9LGYWa5nMARbzGejyWSQG66_CgPz8n_w9pCBsDjfQKByu2ndozz1OeVjdJ43xbBAP1A4Q0Qvsu1VFK_rdS1tlti59OwORNIEVimgDeO9j85Lc', q: 'zatu66ToLe7xzLaEwRQGmQXGQXufew8FTsDHmNSZOVrT5IaNGsPnHiU7v9oyLi5eWlwu-xc2ZuF88keLEfhOSLJcWwt5ZzZFEybvv36CvHmuIOM1_9NBY7k4VU8QBO2rPfIUqAR5z2RP89OTSdulmtONsDQxJaQ0EzeXKZ7mS9s', qi: 'zznzwWLNW6pA3_0EY-PSUB-N1QOoE8xJ63PAwXdyJPokWNatkP80EC-Lx6qRfNxWsufNSBllKo9zaT0AhNX7wzQvzs5dBCBjLQFrtOyXmfWgNQ9mjQbs2x9N5668u5Vkr8rF7X8XTvRwkLy_lVN9aV9nOsFYsbgQKWtSHMNIneo'},
    token: 'eyJhbGciOiJQUzM4NCJ9.YQ.Q5XRmVsIhniyF2WnjtSp3z-KyONClGKuo361_e06SIDUMTD_ugN_AInT8kLqgMIsxSAC4JoRNgJmNiBqrN9uFDQXAR4vzLGOpZMS1z9RNRCIcWLpJXDpGr-BYT_nyEkcmZG9b4nPCoxxJTwqoP8HeKBM3ueN4pRwN2LYUJ3GexLRoqIRX8zW5rmnU_RJSMvi0d_FwSqaFVBhw12iuP-Ku9H-8bJyK4gaB1geuTCVLfJkc1OUyVNcjEnWeKccTnjyBmGz8BMhWsI3oC22jbGxYMQkkyas3bYWMLuxnFeqp0KltugcsM9Ai1k8Z6KVXey-7F8tWSfcrXwdI4uL-WydGQ',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlBTMzg0In0.YQ.pKG4bZWj3qK5cN1nJP63dedIoLCKcMhACxNPF9Cn6hePuKgxHcsmNCV4SeIOn7ArQWavLAZ1YIsrNdVB9hG78rYf1iBVhoqW-lycyaxzl9NZPojp7BzpAfawuAYlpe6CunrQTwODWxXptGyJb7Eqltpw0oKG-kB_ORMKrQostsaLJuRgUd3kn11IC2Z4aaKV1Pu2PprJuvIL6VmM-Gb3cVN9E5IvfK_Kc4ZpiFgnCymLJoILihZO7Tk51hGfpNv2x6nNgw3yfxMfMQozPozpVh1hfQw567BN_WR6qg_Y4Wu7NrwXcIs3ZyzMexFKNhd4cuVDM3dlNdEjfB3e6RG4Ag'
  },
  PS512: {
    public: {alg: 'PS512', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q'},
    private: {alg: 'PS512', d: 'BhwuVyI6w39F8IdQWDMqgz1NF8dnf3CHRFGHOpdxbDwUofIbj9QeZqZJ9olX9Ke0FVqOROMIjN95n1Nu4TiZGvVshet9n2m28-UG2fCp5-hWFSamcljCk9WCff0I6Dm3Ukz_QKofUvg4SL-UIt1glSM-0CTX-LaCS9V0_mEIyGXJdnB_2NiwUPg0Qmsb_N8Q48hGf8Q98Do8XVEtOznPkr5yZPrB_ggcC1BCBWtj5rpe5dsomMS81IyS86vcr1V-EZayrYG83A6uCvDM2TUhWLkq1ojRBaripbnsD6hnmSiwuj92E-26rb7t86X6mLMgJj-gVYAbRFqeHiQjh3nPEQ', dp: 'FQnLzNrI20WSuPK4fWhrMJbP3ZlrgEjLaSKtyWSnU2o2bHqBH6AgKCyeFF6-BhC7iFPSDplVHWmg4mAhbKe2zUhQ24_Gedc_s-ZsdRW9ciB5JH4Tocl3V0ZcABzHrv-KQoWJZwt38txW3sAjLN-KLqh07fTPCBjPYuN7INRbzcU', dq: 'B9RfbOl729Q0fTkwI9Xsch5_mpQGCUl8e518hLwFbTlW6aCb4W4k7lku_6Iv1rl3aiZWlXqFl1Y43U8vlJbAMmzNHfE4nz9wWZmB4hwUalhcJBMgdWET-FbtTNUWYnJNwZsj2TNShzP86plSgUy19dPxOXvUtKVk3UTy_AqFG1E', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q', p: '8BS4fAlZHCWIYZi8psE4E7Pia3xISgJkvRhslyHdgFBRmtqVPwqk2v3qjvKC0m61eLpBdM52mvq1bK1NdqrhVODCKukLhy_PSPn_iEcT62b7inZ9Ev5mpaGOQ1g08kfSzXx_VcIsO-xJEGeAjsOlhP-racRmvlUd_Hj64znBEH0', q: 'wxr80Mgz6Wx3R_--TIOhAHs0FWDQboeq1rm8FEyGDxCPkifcYMG9FEHujwIXD4GrFWPwzCEBJ4BPxZoTchzjfzibOtNHffY6HWHfQcwSiSDAxbhpLLsFZO4N_kkfTC-FWEadVP44s7ynSNUVeZi_zyBrNgc4sodAsoAfPqNAOjk', qi: 'lBbhr6TY1bYKQZg90IN-FuMgQgquCisLt5cOL7Ut8XYcaIdV_QCy9ajHHrF4MBnc-L2DdO1uhGd8ex6DY_4U5wWhWyFDuzscwBFXXRDUPTu-VmulCQ-iIwKjpNMO1XSVtJnwIRC0hb4NH_Y0hLSurxW4IHaqcSnpwHW3RPyb-QA'},
    token: 'eyJhbGciOiJQUzUxMiJ9.YQ.IAfsmI1nPSVabupd5tuNWHItGe2-8O2gKvVZwUrJpTI70ggvg9mxlcT0_uaFjN8px906y6EfzoXAQTzHSTTEo93iNDZv-qLfNWqkj1Gps1HJ7_HJbrBO_VIGwAGshtidZlTlpyV_u7gC1ftCBstLjyGGOPHmhDF3L6OIQEr3EaqtWucKdCow6ALzb8O0ZUomDQ43_-eoWKL-vO8MmIr2FI3ef2CMdElxI0wKQdVQJxhIM4wYd-Oe69fMPA43F6HN_7AHFV3-NmY3vqXEDw8zjz3TrPBrPe1oRslTh3SPuIXQugYdA-2i78CIwzGL4rm5_ZcBD-uidpCPe5zp3IynpQ',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlBTNTEyIn0.YQ.iM9T-CIyeutvJMr3BumoW4Dm98ps1WSNzsEBU2KV9Cpo4D5N7xuK6iQRK7qwYH-5uGFRCJl7Alq3SOKB_AJlTC4jWpKOnyJZCJP5J0BWUGKuV9-q5Rgw0Lok4FYsQlYX_yFStl7vTqna-4G-QwXNt3FYYupM5wMc8WCzAMBarzDJVJLWZoD3xmP-D_6Eo8EDSjJIl_LYABxMk4eph61Fwlk4iWSG8xS3VUU0KlQ5DANTUCXOLHFxFjpmJ-y359wxnoQg1IqRRyYHcZOH-v0m_PWh9G0PL6I58yIc3tl-Co25ZUCfgiF-kKr2kh6-8MZr-eMpm-lNZmhejzd_qojuew'
  },
  RS256: {
    public: {alg: 'RS256', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ'},
    private: {alg: 'RS256', d: 'h-frbD68wgqd3WER0MxbuRFwUhKI2yBQKYLsUX5dPptMA0wBVscszda2eVVP4O_KlcjcRx_VO6TyzyQ_U3Tkg3GG78qCd8DJVwAT5o_rUlHkSw3jz7BnSiSnJRBYVN-CV9w-0gddOmAYoBwFAhw5a751m2qkDE9-M6j_x_jExG_yyxxdNPsdK5meY3CUljLKHimlC0X57kAyKhGuPglR5bYZX37-pTeguEhN2HhPrCNwuAu3-dwwwx0t-o6lQjpBmRKlWmYlMHnYL--WeUsSdWSxDH3kPQQfNOGrj0QoLIwBf0Yco8THtqE7utN3nKlO4gPGKQXvhnm3mB8D97wB', dp: 'rQqcRXB26UOVzsDYkqKjMWz3xKJAxv4bESrFinEp5Lcv3H-ZcniMZDLM_AhV_bqDiPq2I8m6SyezDq3QSvRd7GpuBNydONQYGjWpZa1uMnw4FkA0V9PtNvzneBVEwuvE46UMGFY7hN4eVQi5jENmFYlBvQ_bNwBlVLZiuFWQTJk', dq: 'quM9NcwJPKxrYgVMphJoUtloOUYYgl_J8wz2zqtXK3ZL8OQO4SvOBM370T4-L76doIX0Of5gn12ZeOerMwW14nBryzcgxKCN3ydz4mYTpTLPqVeFli7vrbFbBaAajxSs-diMLActblcNXF-nf-i5sgKepPtFLm7YFaa7fA3fjgk', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n:'p0V6QDPjsjB2CddNxzjUVXKpGAODmqjS0QPMGSDXD_bR_kTyA2zwt2bKOyIyuOvmy8kp7En7hEebopKH9codgGnlZBV47xeyk24NaqI9ZTelrXjXOBjhNF13vTCaVTEI4a9-YFZhi_y07I-QJRU1k6c8vWLEQ6HljboX7YCtN6T1tUzu9-ZZ7qwbHZhZHN4YbbGQfmXJMflzzJ6FnT1qKmtt9zwrMgqhm_KXVuGq9G1LzWFo06nCZD3xJSwFT5d8qbG9gC3jHFaGF_1Vr3ywMAzkO2xGuOuuG0Rq1Nbl_n0yFCgBzYG6q7wEnMc1FUTfOBwj0Cj9CmT_VGSfTPjDoQ', p: '1P9RmWhJF5Ojox6SXfT6mctHlidT6bQ-QJn4Q8T1Jb6LcbvqmqYscMG3V-T3_qf5SQ-ZIxCuCjF3mrm25Bxy_s3xyxgfc8Mr_b0xmjmmJ5Un-2K1kLZFqi9QeBKQQT1MURzy1k9mp4OUo8LGoRFYOqf7wsB9lU4v076WWDE9Ckk', q: 'yQrU_I31esjsa7Pf3ZWzCBdlWNrc7MdMRmEXrcTwMM-HX9H4fyQ47nfhX0mTU4INt9cHu-OAcAw_Bk4-NR5gKmF_pZMT-bN6fbE4URwjZnLvzTm4A-GICJIaQPwzTNQEWYbdCSMtBQZrIt7aLo2cvb1EfmJhcOgCaQmyc06Arpk', qi: 'gsX2O4w_BjXomeG2Ex0FyUQWiFaEKIYdFlhgcPxnWE4CGbVxxqs-Akc-xsp-TU1wffpj6Y6xcBs05VM_6-QRsFPEU6XIp6kPLbKZ4LvWUr5S8RbZd66bKDveCVdsfUTC9WbnqPUTxiqqGCa2Z0w3boaoPhA4erfncP5u0eUQmnI'},
    token: 'eyJhbGciOiJSUzI1NiJ9.YQ.e2qbqtdOozSH-OFSvYBDwPKYyrZuUvDjrNFfFPqTtQz9jxlYvTq3b1K0hB6p18If83JPjX0rw9k7iY17oIHaBFbEfSsomcjQJQEvFVAlB7og9r1-6KbLeCpSVX1UME6hB5MtW9jqU9aC5TZ8Boxk8fBnyHDotXVu5Rsv48-Spf8gQaRaj7nQ7CHuGB3f883S0ZjnJ2-Cp6oJf-wKKVXklmzwRKyQGeobLzvg-vISeij_-vfCn_toIi3BRJWDaXNHe5AsIazzlNrAn0itvabcKXOc-nXyjqmjIoZDoGyuUAIYtT1LAwzNJoAJVPhcW1j2TPmPyYSVd3SP-6sKtaRw5Q',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlJTMjU2In0.YQ.NrCy-7yqd0nBMZxzs4jE1fXTebZO8d5byzGP9T_84UqN3ItHBvJP3e5WZ4WtoA4F3utszcg4SHlq3Kj5cgfmd3YbdZMZz2MIhXANmFG-z959pg6qvp6UXhFdQl4gAGOgv-CtUWvKtruA-MPXj05cygBqgRsQJbfJPR3TcQufjdwgNAfB_4zBEX5HaPSGqJrPJuaGU07NBgXVA5i5um7Tb7hEsFTrmGSamZLsc28o6wiBHgjBOX3d8rPtoc0dVzXPxP2m_-cje26NbevexMuvFPG5epPDNjY92toNY6HklsgzCvx2BVUOrt2N6YKpv-0CPJfZWdaum5CrPQEBeukwtw'
  },
  RS384: {
    public: {alg: 'RS384', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ'},
    private: {alg: 'RS384', d: 'YSf9IFzmgUm3ykcLhjpCWth1b7egu555WQABHmREPO9XdDtWd7fhAKHLsR0tvAbDB2Kea4SWuCqx7kStydgo24HrLR-iH-hLRqEiioEYy9msO5kUo80tShVHIZP-D3_h_hYDktyMLGTho7ZI1nyHAsKJ49JR9GvNclZ2dkrGVNJHJOpsewJdNeZr5Gm7VmsHpKFSruDD3BqnpV19FvfPp_WDfT9zPAfLr_Oxr2J3S0bqWgJYSHLLSxQv3dFCJ0KlMj_LlIQJ3jVa2Bs66eMbks4erxi2vnkmUM07rvlMV7O0KwMlNDd1QI1vgd1Qe9RaPAxinogt6UXY_sjRfjhILw', dp: 'pZ-vYp5pDYlcMTRGGbkWJaCPhhSHyp1vCcFq2fDUn-ozGcSzcGrgDQ1eO8eiBmq0m0YWiZv1amat5iXwTk4syXf6kwi-OB1K4LXJaxR3TVC2eBfMKScnTsapbaid_o-gVwgvgf2k6aT1lZWh8RL9OJqG-9nC_KGEz8yOv_iUDSM', dq: 'f9qz0K-qWmuxS2anbnPpihUp4ylbwh9bWFLFgf-f5STOlsECVQI12eqhkymsikLvCtNFrXgHrLs-dkr9bEVlPRIMEdk3Nm9pT3ekEPIvicVG91DoD8ofW0QYfgfxWG77Rj4Ik058_u1IOrZrWL2_3FjpOwGnD9RdPxkO0qPiXIM', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'zJN18ACmEJ_nSr5d4fwuHl2DQJy9apG_Tkjd1RW_gD7PPhwPs7lR6-FB6zS__6Rl9W2NPLzhr0Q5LAE79e6gU-sMWajVSamntj3Fedap2LJJViwQPlPpmvoChANFRWopETxQwrQ18o-NP84YU-gT1TnjleHi5dBJFrqoP82zadbjR0QHGv2FXOfxYmJIX5aGxK3GPD4CpbguoEJ1phBwfmI8tLoOkS1e4BDloG1DXJ_t28xb8XA39ifpJFBWJhVdr9rPCozbRWw_w5xD8cQ__tixeYXnktGA5gORjoYgbjC8TPG9D4v3cOL8oxypn1ShVHAMsSkYHXY9REByJcNFjQ', p: '_qODmif1jMqXOVaN5mATmDEVpFfWPno5OnR__LT_6hWmdOElAdJTCGLlSb3jrY9LGYWa5nMARbzGejyWSQG66_CgPz8n_w9pCBsDjfQKByu2ndozz1OeVjdJ43xbBAP1A4Q0Qvsu1VFK_rdS1tlti59OwORNIEVimgDeO9j85Lc', q: 'zatu66ToLe7xzLaEwRQGmQXGQXufew8FTsDHmNSZOVrT5IaNGsPnHiU7v9oyLi5eWlwu-xc2ZuF88keLEfhOSLJcWwt5ZzZFEybvv36CvHmuIOM1_9NBY7k4VU8QBO2rPfIUqAR5z2RP89OTSdulmtONsDQxJaQ0EzeXKZ7mS9s', qi: 'zznzwWLNW6pA3_0EY-PSUB-N1QOoE8xJ63PAwXdyJPokWNatkP80EC-Lx6qRfNxWsufNSBllKo9zaT0AhNX7wzQvzs5dBCBjLQFrtOyXmfWgNQ9mjQbs2x9N5668u5Vkr8rF7X8XTvRwkLy_lVN9aV9nOsFYsbgQKWtSHMNIneo'},
    token: 'eyJhbGciOiJSUzM4NCJ9.YQ.UP5iu3yCPHN9zXCGzJzRzp9NbDvi9CrgEF956CtB39lCO-AXE4K88KdfIuiCYbYFWoO2wqE_P76Rp2bklpX5YEPReIhaBf6CwhwNLtuop-1hVeGIgnmET2LTXBbUJ-nLyZ0j8vRjD35r7soLxtHRIvyJfSEu01poDzRqvcoqMUBi8KBPWErbU706JY1aa1fpsjXF_pilMa8MRJqvSdJxRIqTMyPxfFuVIYfZwR8eW0YlJ7XfAvNjwapF9mSWmqAgzBjxXsQEQjPPIJRI4OSujQLXcW-Q7IOcTHCR-5_asX6vf9gyx7ekiS9zQ9bmv0qMh2hUp3TmlWPWfvG_rQTLVQ',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlJTMzg0In0.YQ.DUg-dErL6-b6poLtMTbxIcGFq_ggqaoSyFU1fSeDFFcyEl-6RvElKRiEq_1VyDEbpsV5-C8bOhpJZr-OlapAleCQqtrbp4JhgAtfvQGuK9wcJtgWQsxnjbLVYRGtjCGEBdw1g4uHv7Ljm2OmD3hVUxm_bmXiel0WPW0vQsVo6TztIv9qYPQvni3KQ_icheGzSI-7jfglIVABwa2Kdr3mwfdt7RaB07U4zkZ6Bwd-Ae3RCLhQ_Xe5XUxc0r2LJfNdMrwOcC49LzUEZq33IN_mqPBS1YlcoexsqjiRpEepDX07o1gDXwUDNpDl00EkHUInyufAaKcuTbbSu0oI0x0wvw'
  },
  RS512: {
    public: {alg: 'RS512', e: 'AQAB', ext: true, key_ops: ['verify'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q'},
    private: {alg: 'RS512', d: 'BhwuVyI6w39F8IdQWDMqgz1NF8dnf3CHRFGHOpdxbDwUofIbj9QeZqZJ9olX9Ke0FVqOROMIjN95n1Nu4TiZGvVshet9n2m28-UG2fCp5-hWFSamcljCk9WCff0I6Dm3Ukz_QKofUvg4SL-UIt1glSM-0CTX-LaCS9V0_mEIyGXJdnB_2NiwUPg0Qmsb_N8Q48hGf8Q98Do8XVEtOznPkr5yZPrB_ggcC1BCBWtj5rpe5dsomMS81IyS86vcr1V-EZayrYG83A6uCvDM2TUhWLkq1ojRBaripbnsD6hnmSiwuj92E-26rb7t86X6mLMgJj-gVYAbRFqeHiQjh3nPEQ', dp: 'FQnLzNrI20WSuPK4fWhrMJbP3ZlrgEjLaSKtyWSnU2o2bHqBH6AgKCyeFF6-BhC7iFPSDplVHWmg4mAhbKe2zUhQ24_Gedc_s-ZsdRW9ciB5JH4Tocl3V0ZcABzHrv-KQoWJZwt38txW3sAjLN-KLqh07fTPCBjPYuN7INRbzcU', dq: 'B9RfbOl729Q0fTkwI9Xsch5_mpQGCUl8e518hLwFbTlW6aCb4W4k7lku_6Iv1rl3aiZWlXqFl1Y43U8vlJbAMmzNHfE4nz9wWZmB4hwUalhcJBMgdWET-FbtTNUWYnJNwZsj2TNShzP86plSgUy19dPxOXvUtKVk3UTy_AqFG1E', e: 'AQAB', ext: true, key_ops: ['sign'], kty: 'RSA', n: 'tvkXuWnosKL_VVzr_7V0BzsNhR4JVvlbR_llfWrbwi3WtfudQ_vQ1PmyTuCIZI8Hqyadu_S0XVleUS_s5IIdTxQeGlIuE7D3tSIvfO5gkj9ISgOUQ_yZTo8ZRDMbHDSV9svV2XEsDUglE8-s_-J1Jv22lc4QrPIFxZm-W5hDE8iZiWx1Rh7oozJH742J0EnflfygVbngxnC8at_qtA1xYXeBSA_UaZvnlBsDXUiQXNhLPBcNKlhsAtEzei61zViOgiWwn6fPubjuxBOjLnYfHwtlQyd4GrwH0zrogSgsooq52Gxscw0ZtaSwVW9mqer0e8VHFak9VCOMnNa3T_j91Q', p: '8BS4fAlZHCWIYZi8psE4E7Pia3xISgJkvRhslyHdgFBRmtqVPwqk2v3qjvKC0m61eLpBdM52mvq1bK1NdqrhVODCKukLhy_PSPn_iEcT62b7inZ9Ev5mpaGOQ1g08kfSzXx_VcIsO-xJEGeAjsOlhP-racRmvlUd_Hj64znBEH0', q: 'wxr80Mgz6Wx3R_--TIOhAHs0FWDQboeq1rm8FEyGDxCPkifcYMG9FEHujwIXD4GrFWPwzCEBJ4BPxZoTchzjfzibOtNHffY6HWHfQcwSiSDAxbhpLLsFZO4N_kkfTC-FWEadVP44s7ynSNUVeZi_zyBrNgc4sodAsoAfPqNAOjk', qi: 'lBbhr6TY1bYKQZg90IN-FuMgQgquCisLt5cOL7Ut8XYcaIdV_QCy9ajHHrF4MBnc-L2DdO1uhGd8ex6DY_4U5wWhWyFDuzscwBFXXRDUPTu-VmulCQ-iIwKjpNMO1XSVtJnwIRC0hb4NH_Y0hLSurxW4IHaqcSnpwHW3RPyb-QA'},
    token: 'eyJhbGciOiJSUzUxMiJ9.YQ.D1c3wqKtDBxSqxHg7uZ2Nelvek1Vjts8PcPlim7b4xylD_LWHqm2m-lU_WaX4f-YiA-w8pgXe5FNnZR_SZcDUTjr5uJq1rYgm0VTRS96N8jj8xkNhDcln-nA01DPOIZQ9yhQfhYCBC4C2PySd_xTzyOxoTu8-zbodRp9f6_W0fGcKrPlwmSk6ZtrJJQm22AG2aaX-9W4VDadiHIYAmcUEGx3emGxn8GCUjWfy4GGU_9B3rL8fWYAhI7TvOlAKaoa01NWxpZkO04IhYR0Z1CjTWCyWZASyFJcjlYq4kyp7t5-tC0arCS1iq8L1PXSJh01ywton52KlRjd5Jl0kjUgZQ',
    withKid: 'eyJraWQiOiJpZCIsImFsZyI6IlJTNTEyIn0.YQ.pVEQEd4tjcnVk1X7t_FAruCaEd8HQ1x5ZidR9Ltu_RS4D1w69KNvnfmPTpI7B4hgyoK-FifMWLdS1mOY7c6o3USYiuYGNrIAGOU_flpFSwZKNGCM7CuMa5BrFtEESfT1FLMufPCFHEJnoIkTyxKD83Q2PnBSPf6otec1Z-eK0cmlP4ZVqsEhFFeWf0Fv8321oKxJKdrw0vyEaLcp8izA2aZ7tMHbg9xq3LVXZYH0BJwZrGisThvYe3ubT1C9gbnAUiVegAJXJ_LPa_kbfQ7olofJyIKiWMesGFSg64l8bOFILPI533eYZf5YAsfVhY2ZPoCPOPLIa76yLyGHOE7spg'
  },
  ES256: {
    public: {crv: 'P-256', ext: true, key_ops: ['verify'], kty: 'EC', x: '8B6DdEcf9LgGjkl07sjBmm43r_f_46chavGDCXdwTs4', y: 'ny6GcIxI8agD7zCZFfzMdh7PezRsU9UTra2BODJEE40'},
    private: {crv: 'P-256', d: 'cpNptDUu2vtVu3Hg21lQBP2fq1F7cetbijs2Q_Z7p7g', ext: true, key_ops: ['sign'], kty: 'EC', x: '8B6DdEcf9LgGjkl07sjBmm43r_f_46chavGDCXdwTs4', y: 'ny6GcIxI8agD7zCZFfzMdh7PezRsU9UTra2BODJEE40'},
    token: 'eyJhbGciOiJFUzI1NiJ9.YQ.8_4h-1RqlWGeiuY4NWk1OX30SfEXGMdffGo4SvauOyJy_DRAu5cKKt9MFAQMsAjPej7NbG6fJ1-Z8xfX5U8H3g'
  },
  ES384: {
    public: {crv: 'P-384', ext: true, key_ops: ['verify'], kty: 'EC', x: 'HkpD9lbkJQL8DRIqqOTFG-VMUX-asvxcGZ1XLpN5FM-VRHwtH0rCSGi1THHWk4x9', y: 'fG-hS1QebrLApgwFd7bCVIIAF1L3SNMrL_RKADi8JcHZkgKtSHjr8-ft7HG1lcuy'},
    private: {crv: 'P-384', d: 'KzEPTqZXwNAx5OIgRiUa-iw5dUnEe-i-fXemiyhCgNA8kpHQ64GPaVlsI4ZYeLrP', ext: true, key_ops: ['sign'], kty: 'EC', x: 'HkpD9lbkJQL8DRIqqOTFG-VMUX-asvxcGZ1XLpN5FM-VRHwtH0rCSGi1THHWk4x9', y: 'fG-hS1QebrLApgwFd7bCVIIAF1L3SNMrL_RKADi8JcHZkgKtSHjr8-ft7HG1lcuy'},
    token: 'eyJhbGciOiJFUzM4NCJ9.YQ.FC9EOKlr-V8mJpL0N_sBGH_lU7OerpFe26DPOztkXsaDkX8MZrd-HP7Ej7tE5pK_9lP77It0L8TXqXHpApTmu8gYhbdvVhuYL9j0NIzzBHRgxNu_QBnxoj9ZppyuCLg8'
  },
  ES512: {
    public: {crv: 'P-521', ext: true, key_ops: ['verify'], kty: 'EC', x: 'AYCWh_Ke7CTWDY3ssog9SD8Ugjs7j_uUaZWcB1tR8upMkpd2peH4gp5BjtXYDEZrHQCF02YNWmuskyJttL6ZDp09', y: 'AfXjzgorxGOQFuGigV9Igm-5sqRiAJZWXzCHEjJjNj_SEtxC3N4iETCoUOhLys9nkV-t3Xog-1xYPIoQ0qUJ5157'},
    private: {crv: 'P-521', d: 'AT4boQwA47hWCiv0_220NwtyhJ5fRuSwukZh--SdNlh7YDUekEHoUbdI3s6Ss2hxnWMlF83r0cKLr5beQ7rjmCdb', ext: true, key_ops: ['sign'], kty: 'EC', x: 'AYCWh_Ke7CTWDY3ssog9SD8Ugjs7j_uUaZWcB1tR8upMkpd2peH4gp5BjtXYDEZrHQCF02YNWmuskyJttL6ZDp09', y: 'AfXjzgorxGOQFuGigV9Igm-5sqRiAJZWXzCHEjJjNj_SEtxC3N4iETCoUOhLys9nkV-t3Xog-1xYPIoQ0qUJ5157'},
    token: 'eyJhbGciOiJFUzUxMiJ9.YQ.AC_tAldNQisH32puHau0lrEnopYV8YnymANNNJIX8RfsRsefQBH4oTdgci3L81FbfBaT2prqnvP1ckml91CATcupAYtdnSQorPFC9NoC3yamolf9ysF0-V2Ukh-TQ9nHdUUxLsPgLIqxPXzwCJUchC-VqYD2J4Buzhnw84asd7GGzY22'
  }
}

const payload = 'a';

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
      jwe.sign(payload, keys[algo].private)
      .then(res => expect(res).toEqual(jasmine.any(String)))
    );
  });

  ['RS256', 'RS384', 'RS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo}`, () =>
      jwe.sign(payload, keys[algo].private)
      .then(res => expect(res).toEqual(keys[algo].token))
    );
  });

  ['HS256', 'HS384', 'HS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo}`, () =>
      jwe.sign(payload, keys[algo].shared)
      .then(res => expect(res).toEqual(keys[algo].token))
    )
  });

  ['ES256', 'ES384', 'ES512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo}`, () =>
      jwe.sign(payload, keys[algo].private, { alg: algo })
      .then(res => expect(res).toBeDefined())
    )
  });

  ['RS256', 'RS384', 'RS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo} and headers`, () =>
      jwe.sign(payload, keys[algo].private, { kid: 'id' })
      .then(res => expect(res).toEqual(keys[algo].withKid))
    );
  });

  ['HS256', 'HS384', 'HS512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo} and custom header`, () =>
      jwe.sign(payload, keys[algo].shared, { kid: 'id' })
      .then(res => expect(res).toEqual(keys[algo].withKid))
    )
  });

  ['ES256', 'ES384', 'ES512'].map(algo => {
    supports({ importKey: algo, sign: algo }).it(`signs with ${algo} and custom header`, () =>
      jwe.sign(payload, keys[algo].private, { alg: algo, kid: 'id' })
      .then(res => {
        expect(res).toBeDefined();
        return jwe.decode(res);
      })
      .then(decoded => expect(decoded.header).toEqual({ alg: algo, kid: 'id' }))
    )
  });
})

describe('verify', () => {
  ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'].map(algo => {
    supports({ importKey: algo, verify: algo }).it(`verifies with ${algo}`, () =>
      jwe.verify(keys[algo].token, keys[algo].public)
      .then(res => expect(res).toEqual(payload))
    );
  });

  ['HS256', 'HS384', 'HS512'].map(algo => {
    supports({ importKey: algo, verify: algo }).it(`verifies with ${algo}`, () =>
      jwe.verify(keys[algo].token, keys[algo].shared)
      .then(res => expect(res).toEqual(payload))
    )
  });

  ['ES256', 'ES384', 'ES512'].map(algo => {
    supports({ importKey: algo, verify: algo }).it(`verifies with ${algo}`, () =>
      jwe.verify(keys[algo].token, keys[algo].public)
      .then(res => expect(res).toEqual(payload))
    )
  });
})
