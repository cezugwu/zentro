import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import { BASE_URL } from "../utilis/config";


const guest = localStorage.getItem("guest")
const token = localStorage.getItem("access");
const headers = {
"Content-Type": "application/json",
...(token && { "Authorization": `Bearer ${token}` }),
};

export const fetchCart = async () => {
const response = await fetch(`${BASE_URL}/cart/?session_id=${guest}`, {
    method:'GET',
    headers,
});
if (!response.ok) {
    throw new Error("Network response was not ok");
}
return response.json();
}

export const clearToCart = async() => {
    const response = await fetch(`${BASE_URL}/clear/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
        session_id: guest,
        }),
    });
    if (!response.ok) {
        throw new Error("failed to add to cart");
    }
    return response.json();
}

export const addToCart = async ({ slug, quantity, action }) => {
    const response = await fetch(`${BASE_URL}/add/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
        session_id: guest,
        slug,
        quantity,
        action,
        }),
    });
    if (!response.ok) throw new Error("failed to add to cart");
    return response.json();
};

export const removeToCart = async({slug}) => {
    const response = await fetch(`${BASE_URL}/remove/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
        session_id: guest,
        slug: slug,
        quantity: 1,
        }),
    });
    if (!response.ok) {
        throw new Error("failed to add to cart");
    }
    return response.json();
}

export const deleteToCart = async({slug}) => {
    const response = await fetch(`${BASE_URL}/delete/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
        session_id: guest,
        slug: slug,
        }),
    });
    if (!response.ok) {
        throw new Error("failed to add to cart");
    }
    return response.json();
}

export const fetchProduct = async () => {
    const response = await fetch(`${BASE_URL}/product/`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export const fetchProductDetail = async (slug) => {
    const response = await fetch(`${BASE_URL}/product/${slug}`, {
        method:'GET',
        headers,
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}
