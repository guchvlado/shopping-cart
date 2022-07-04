import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ShoppingCartProviderProps {
    children: ReactNode
}

interface CartItem {
    id: number;
    quantity: number;
}

interface ShoppingCartContext {
    getItemQuantity: (id: number) => number;
    increaseItemQuantity: (id: number) => void;
    decreaseItemQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    openCart: () => void;
    closeCart: () => void;
    cartQuantity: number;
    cartItems: CartItem[];
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({children}: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', [])
    const [isOpen, setIsOpen] = useState(false)

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

    const getItemQuantity = (id: number) => {
        return cartItems.find(item => item.id === id)?.quantity || 0;
    }

    const increaseItemQuantity = (id: number) => {
        setCartItems(oldItems => {
            if (oldItems.find(item => item.id === id) == null) {
                return [...oldItems, {id, quantity: 1}]
            }
            return oldItems.map(item => {
                if (item.id === id) {
                    return {...item, quantity: item.quantity + 1}
                }
                    return item
            })
        })
    }

    const decreaseItemQuantity = (id: number) => {
        setCartItems(oldItems => {
            if (oldItems.find(item => item.id === id)?.quantity === 1) {
                return oldItems.filter(item => item.id !== id);
            }
            return oldItems.map(item => {
                if (item.id === id) {
                    return {...item, quantity: item.quantity - 1}
                }
                    return item
            })
        })
    }

    const removeFromCart = (id:number) => {
        setCartItems(oldItems => oldItems.filter(item => item.id !== id));
    }

    const openCart = () => {
        setIsOpen(true)
    }

    const closeCart = () => {
        setIsOpen(false)
    }



    return (
        <ShoppingCartContext.Provider 
            value={{
                getItemQuantity, 
                increaseItemQuantity, 
                decreaseItemQuantity, 
                removeFromCart,
                openCart,
                closeCart,
                cartItems,
                cartQuantity}}>
            {children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCartContext.Provider>
    )
}