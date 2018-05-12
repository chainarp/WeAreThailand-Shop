
export class Product{
    id: number;
    productName: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    category: string;
    color: string;
    size: number;
    stock: number;
    wishlist: number;
    gallery: [
        {
            id: number;
            thumbnail: string;
            images: string;
        }
    ]
}