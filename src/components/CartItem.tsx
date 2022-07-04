import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";

import storeItems from '../data/items.json';
import { formatCurrency } from "../util/formatCurrency";

interface CartItemProps {
    id: number;
    quantity: number;
}

export function CartItem({id, quantity}: CartItemProps) {
    const {removeFromCart} = useShoppingCart();

    const item = storeItems.find(item => item.id === id);
    if (item == null) return null;

    return (
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            <img src={item.imgUrl} alt={item.name}
            style={{
                width: '125px',
                height: '75px',
                objectFit: 'contain'
            }} />
            <div className="me-auto">
                <div style={{maxWidth: '105px'}}>
                    {item.name}{' '}
                    {quantity > 0 && (
                        <span className="text-muted">x{quantity}</span>
                    )}
                </div>
                <div>
                    <span className="text-muted">{formatCurrency(item.price)}</span>
                </div>
            </div>
            <div>{formatCurrency(item.price * quantity)}</div>
            <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeFromCart(item.id)}
            >
                &times;
            </Button>
        </Stack>
    )
}