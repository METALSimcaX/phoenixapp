export interface PromotionItem
{
    promotion_id: string;
    name: string;
    condition_id: string;
    condition_1: string;
    condition_2: string;
    limit_use: number;
    min_value: any;
    required: PromotionConditionItem[];
    discount: PromotionDiscountItem[];
    isActive: boolean;
    distribution_channel: number;
}

export interface PromotionConditionItem
{
    promotion_id: string;
    name: string;
    condition_id: string;
    material_id: string;
    quantity: any;
    min_value: any;
    group_id: any;
    group_type: any;
    is_group: any;
}

export interface PromotionDiscountItem
{
    condition_id: string;
    material_id: string;
    min_quantity: string;
    bon_add_quantity: any;
    material_quantity: number;
    bon_esp_quantity: any;
    type_scale: string;
    type_rappel: string;
    unit_quantity: any;
    value_by_porc: any;
    value_by_direc: any;
    group_material: string;
}