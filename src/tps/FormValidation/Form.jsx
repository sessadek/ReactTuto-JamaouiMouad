import { useEffect, useState } from "react"

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

const requiredFieldMessage = field => `The field ${capitalizeFirstLetter(field)} is Required`;

const initialData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    date: new Date().toISOString().split('T')[0],
    colors: [],
    gender: '',
    country: '',
    acceptCondition: false
}

const colors = ['red', 'green', 'yellow'];

const countries = ['Select Country', 'Morocco', 'France', 'United States', 'Canada', 'Australia'];

export default function Form () {

    const [data, setData] = useState(initialData);

    const [errors, setErrors] = useState({});

    const [submitIsDisabled, setSubmitIsDisabled] = useState(true)

    const validateField = (name, value) => {
        let error = '';
        const emailPattern = /\S+@\S+\.\S+/;
        switch (name) {
            case 'name':
                if(!value.trim()) error = requiredFieldMessage(name);
                break;
            case 'email':
                if(!value.trim()) {
                    error = requiredFieldMessage(name);
                } else if(!emailPattern.test(value)) {
                    error = `The field ${capitalizeFirstLetter(name)} is not valid`;
                }
                break;
            case 'phone':
                if(!value.trim()) {
                    error = requiredFieldMessage(name);
                } else if (!/^\d{10}$/.test(value)) {
                    error = 'Phone number must be 10 digits.';
                }
                break;
            case 'message':
                if(!value.trim()) {
                    error = requiredFieldMessage(name);
                } else if(value.length <= 200) {
                    error = `The field ${capitalizeFirstLetter(name)} no longer riched ${value.length}/${200}`;
                }
                break;
            case 'date':
                if(!value.trim()) error = requiredFieldMessage(name);
                break;
            case 'colors':
                if(value.length === 0) error = `The field ${capitalizeFirstLetter(name)} should select at least one`;
                break;
            case 'gender':
                if(!value.trim()) error = requiredFieldMessage(name);
                break;
            case 'country':
                if(!value.trim() || value === 'Select Country') error = requiredFieldMessage(name);
                break;
            case 'acceptCondition':
                if(!value) error = requiredFieldMessage(name);
                break;
            default:
                break;
        }
        return error;
    }

    const reset = () => {
        setData(initialData);
        setErrors({});
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const validateData = Object.keys(data).reduce((acc, field) => {
            const error = validateField(field, data[field]);
            if(error) acc[field] = error;
            return acc;
        }, {});

        if(Object.keys(validateData).length > 0) {
            setErrors(validateData);
        } else {
            reset();
        }
    }

    const handleReset = () => {
        reset();
    }

    const handleChange = (e) => {

        let fieldValue = e.target.value;
        
        if(e.target.type === 'checkbox') fieldValue = e.target.checked;

        let selected;
        if(e.target.name === 'colors') {
            if(data.colors.includes(e.target.value)) {
                selected = data.colors.filter((color) => color !== e.target.value);
            } else {
                selected = [...data.colors, e.target.value]
            }
            setData({...data, [e.target.name] : selected});

        } else {
            setData({...data, [e.target.name] : fieldValue});
        }
        
        let error = validateField(e.target.name, fieldValue);
        if(e.target.name === 'colors') {
            error = validateField(e.target.name, selected);
        }

        if(error) {
            setErrors(prevState => ({...prevState, [e.target.name]: error}));
        } else {
            setErrors(prevState => {
                const {[e.target.name] : _, ...updateErrors} = prevState;
                return updateErrors;
            });
        }
    }

    const displayErrors = () => {
        const errorList = Object.values(errors);
        if(errorList.length) {
            return (<div>
                <h4>Error List</h4>
                <ul>
                    { errorList.map((error, key) => <li key={key}>{error}</li>) }
                </ul>
            </div>)
        }
        return undefined;
    }

    const displayError = (field) => {
        if(errors.hasOwnProperty(field)) return <div>{errors[field]}</div>
        return undefined;
    }

    useEffect(() => {
        setSubmitIsDisabled(Object.keys(errors).length > 0)
    }, [errors]);

    return (
        <>
        { JSON.stringify(data) }
        <hr />
        {displayErrors()}
        <hr />
        <h1>TP Form with React Example</h1>
        <hr />
        <h6>{data.name && data.name}, {data.email && data.email}</h6>
        <hr />
        <form onSubmit={handleSubmit} onReset={handleReset}>
            <div>
                <label htmlFor="name">Name : </label>
                <input type="text" name="name" id="name" value={data.name} onChange={handleChange} />
                { displayError('name') }
            </div>
            <div>
                <label htmlFor="email">Email : </label>
                <input type="email" name="email" id="email" value={data.email} onChange={handleChange} />
                { displayError('email') }
            </div>
            <div>
                <label htmlFor="phone">Phone : </label>
                <input type="phone" name="phone" id="phone" value={data.phone} onChange={handleChange} />
                { displayError('phone') }
            </div>

            <div>
                <label htmlFor="message">Message : </label>
                <textarea name="message" id="message" value={data.message} onChange={handleChange}>{data.message}</textarea>
                { displayError('message') }
            </div>
            
            <div>
                <label htmlFor="date">Date : </label>
                <input type="date" name="date" id="date" value={data.date} onChange={handleChange} />
                { displayError('date') }
            </div>
            <div>
                <label htmlFor="">Colors : </label>
                {colors.map((color, key) => {
                    return <div key={key} className="d-inline">
                        <input type="checkbox" name="colors" value={color} id={color} checked={data.colors.includes(color)} onChange={handleChange} key={key} />
                        <label htmlFor={color}>{color}</label>
                    </div>
                })}
                { displayError('colors') }
            </div>
            <div>
                <div>
                    <input type="radio" name="gender" id="man" value="man" checked={data.gender === "man"} onChange={handleChange}/>
                    <label htmlFor="man">Man</label>
                    <input type="radio" name="gender" id="woman" value="woman" checked={data.gender === "woman"} onChange={handleChange}/>
                    <label htmlFor="woman">Woman</label>
                </div>
                { displayError('gender') }
            </div>
            <div>
                <label htmlFor="">select Country : </label>
                <select name="country" id="country" value={data.country} onChange={handleChange}>
                    {countries.map((country, key) => <option value={country} key={key} >{country}</option>)}
                </select>
                { displayError('country') }
            </div>
            <div>
                <input type="checkbox" name="acceptCondition" id="acceptCondition" checked={data.acceptCondition} onChange={handleChange}/>
                <label htmlFor="acceptCondition">acceptCondition</label>
                { displayError('acceptCondition') }
            </div>
            <button type="submit" disabled={submitIsDisabled}>Submit</button>
            <button type="reset">Reset</button>
        </form>
        </>
    )
}