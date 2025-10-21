import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from '../utilis/config';


const Pending = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const token = localStorage.getItem("access");
    const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
    };

    const flutterVerify = async({tx_ref, transaction_id}) => {
        const response = await fetch(`${BASE_URL}/fluttercall/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            status: status,
            tx_ref: tx_ref,
            transaction_id: transaction_id
        }),
        });
        if (!response.ok) {
            throw new Error("failed to add to cart");
        }
        return response.json();
    }

    const mutationFlutterVerify = useMutation({
        mutationFn: flutterVerify,
        onSuccess: (data) => {
            console.log(data)
        },
    });

    const status = searchParams.get("status");
    const tx_ref = searchParams.get("tx_ref")
    const transaction_id = searchParams.get("transaction_id")

    useEffect(() => {
    if (status && tx_ref && transaction_id) {
        if (status === 'completed') {
            mutationFlutterVerify.mutate({ tx_ref, transaction_id });
        }
    }
    }, [status, tx_ref, transaction_id]);



    return (
        <div className='mt-[100px]'>
            {mutationFlutterVerify.isLoading && <p>Verifying payment...</p>}
            {mutationFlutterVerify.isError && <p>Error verifying payment</p>}
            {mutationFlutterVerify.isSuccess && <p>Payment verified successfully!</p>}
        </div>
    );
}

export default Pending;