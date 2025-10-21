import { X } from 'lucide-react';
import { BASE_IMAGE_URL } from '../utilis/config';

const OrderSummary = ({item}) => {
    const {title, image, price} = item?.product;
    return (
        <div className='grid grid-cols-[5fr_1fr_1fr] items-center border-b-2 p-2'>
            <div className='w-full flex items-center'>
                <img src={`${BASE_IMAGE_URL}/${image}`} className='w-16 h-16 object-cover' />
                <div className='ml-2 mr-5'>{title?.slice(0,50)+' . . .'}</div>
            </div>
            <div className='flex items-center gap-[1px]'><span className='text-[0.8em]'>NGN</span>{Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className='flex items-center justify-end'><X className='w-4 h-4' /> {item.quantity}</div>
        </div>
    );
}

export default OrderSummary;