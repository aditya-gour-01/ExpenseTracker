import React,{useState, useEffect} from 'react';
import {toast,ToastContainer} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';

const AddExpense=()=>{
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        ExpenseItem:'',
        ExpenseDate:'',
        ExpenseCost:'',
    });

    const userId= localStorage.getItem('userId');
    //useeffect is used for running code automatically on component load/update
    useEffect(()=>{
        if(!userId){
            navigate('/login');
        }
    },[]); //[]empty square bracket for Run only once when component mounts. else it runs repeatedly.

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value}); ///...formData to persist the previous value we set in the form field so you add name then email then we want the name to be also included in the state variable 
    };

    const handleSubmit=async(e)=>{
        e.preventDefault(); //to stop loading of page since button is by default set to true to reload the page once clicked
        try{
            const response = await fetch("http://127.0.0.1:8000/api/add_expense/",{
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({...formData, UserId:userId}) //spread operator to keep the previous data intact and not to lose the existing data and stringify to convert JS object into JSON string
            });
            const data=await response.json(); //convert back the JSON response into JS object
            if(response.status===201){
                toast.success(data.message);
                setTimeout(()=>{
                    navigate('/dashboard');
                },2000)
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            console.error('Error',error);
            toast.error('Something went wrong in adding expense, Try again');
        }
    };
    return(
        <div className='container mt-5'>
            <div className='text-center mb-4'>
                <h2><i className='fas fa-plus-circle me-2'></i> Add Expense</h2>
                <p className='text-muted'>Addition of Expense</p>
            </div>

            <form className='p-4 rounded shadow mx-auto' style={{maxWidth:'400px'}} onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label'>Expense date</label>
                        <div className='input-group'>
                            <span className='input-group-text'>
                                <i className='fas fa-calendar-alt'></i>
                            </span>
                            <input type='Date' name='ExpenseDate' value={formData.ExpenseDate} className='form-control' onChange={handleChange} required/>
                        </div>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Expense Item</label>
                        <div className='input-group'>
                            <span className='input-group-text'>
                                <i className='fas fa-shopping-cart'></i>
                            </span>
                            <input type='text' name='ExpenseItem' value={formData.ExpenseItem} className='form-control' onChange={handleChange} required placeholder='Enter expense item (e.g. Groceries, Milk)'/>
                        </div>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Expense Cost (Rs.)</label>
                        <div className='input-group'>
                            <span className='input-group-text'>
                                <i className='fas fa-rupee-sign'></i>
                            </span>
                            <input type='number' name='ExpenseCost' value={formData.ExpenseCost} className='form-control' onChange={handleChange} required placeholder='Enter the cost of expense'/>
                        </div>
                </div>

            <button type="submit" className='btn btn-primary w-100 mt-3'><i className='fas fa-plus me-2'></i>Create Expense</button>
            </form>
            <ToastContainer/>
        </div>
    )
}
export default AddExpense;