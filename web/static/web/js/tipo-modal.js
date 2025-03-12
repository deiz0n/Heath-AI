export class ExameBasico {
    constructor(tipo, img_pd_cima, img_pd_lateral, img_pe_cima, img_pe_lateral, img_ambos, prontuario) {
        this.tipo = tipo
        this.img_pd_cima = img_pd_cima;
        this.img_pd_lateral = img_pd_lateral;
        this.img_pe_cima = img_pe_cima;
        this.img_pe_lateral = img_pe_lateral;
        this.img_ambos = img_ambos;
        this.prontuario = prontuario;
    };
};

export class ExameCompleto {
    constructor(raiox, ressonancia, prontuario) {
        this.raiox = raiox;
        this.ressonancia = ressonancia;
        this.prontuario = prontuario;
    }
};
