import React from 'react';
import InputMask from 'react-input-mask';

const InputMasker = React.forwardRef(({ mask, value, onChange, ...props }, ref) => (
    <InputMask mask={mask} value={value} onChange={onChange}>
        {(inputProps) => <input {...inputProps} className={props.className} ref={ref} />}
    </InputMask>
));

export default InputMasker;
