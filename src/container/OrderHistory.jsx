import React from 'react';


const OrderHistory = ({item}) => {
    const {name, quantity, price, order_date, order_id, image} = item;
    return (
        <div className='md:w-full w-[700px] h-[120px] mb-2 flex justify-between items-center border-b-2'>
            <div className='flex items-center'>
                <div className='w-[60px] h-[70px] ml-3'><img src={`http://127.0.0.1:8000/${image}`} alt="" /></div>
                <div className='ml-5'>
                    <div>{name}</div>
                    <div>{(order_date).split('T')[0]}</div>
                    <div>{order_id}</div>
                </div>
            </div>
            <div className='flex gap-[40px] lg:gap-[200px]'>
                <div className='flex gap-1'><div>quantity:</div><div>{quantity}</div></div>
                <div className='mr-2'>${price}</div>
            </div>

        </div>
    );
}

export default OrderHistory;