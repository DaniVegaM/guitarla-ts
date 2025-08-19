import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useMemo } from 'react'
import type { CartItem, Guitar } from '../types/index.js'

const useCart = () => {
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    const MAX_ITEMS = 5

    //NOTA: El state en React es asincrono, lo que significa que si lees el valor del state inmediatamente despues de usar "setState" podrías
    //Obtener un valor anterior, para leerlo usa mejor useEffect
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    //IMPORTANTE: No confundir useState como los datos de la DB real, todo esto es frontend unicamente, aún es neceario en un. caso real,
    //mandar los datos a la DB

    function addToCart(item : Guitar) {
        const itemExists = cart.findIndex(existingItem => existingItem.id == item.id)
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const currentCart = [...cart]
            currentCart[itemExists].quantity++ //NOTA: Es necesario sacar copia del state y luego hacer el set para no mutarlo con ++
            setCart(currentCart)
        } else {
            const newItem : CartItem = {...item, quantity: 1}
            setCart([...cart, newItem])
        }
    }

    function removeFromCart(id : Guitar['id']) {
        setCart(prevCart => prevCart.filter(item => item.id !== id))
    }

    function increaseQuantity(id : Guitar['id']) {
        setCart(prevCart => prevCart.map(item => item.id === id && item.quantity < MAX_ITEMS ? { ...item, quantity: item.quantity + 1 } : item))
    }

    function decreaseQuantity(id : Guitar['id']) {
        setCart(prevCart => prevCart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
    }

    function clearCart() {
        setCart([])
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart]) //Se llama State Derivado porque depende directamente del state de cart
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.quantity * item.price, 0), [cart])


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

export default useCart