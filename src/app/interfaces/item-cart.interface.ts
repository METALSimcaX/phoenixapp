export interface ItemCart
{
    barCode: string;
    id: number;
    isLote: boolean;
    materialId: string;
    nombre: string;
    price: number;
    type: string;
    stock?: string;
    unique: number;
    imei: string;
    charg: string;
    havePromo: boolean;
    promoID: string;
    promoName: string;
    promoCode: string;
    promoPrice: number;
}