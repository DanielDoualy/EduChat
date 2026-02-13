import Image from 'next/image';

export default function Icon({ name, size = 20, className = '', alt = '' }) {
    return (
        <Image 
            src={`/icons/${name}.svg`}
            alt={alt || name}
            width={size}
            height={size}
            className={className}
        />
    );
}