import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ManageExpense = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);

    const userId = localStorage.getItem('userId');
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
        fetchExpenses(userId);
    }, []);

    const fetchExpenses = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userId}`);
            const data = await response.json();
            setExpenses(data);
        }
        catch (error) {
            console.error("Error fetching expenses", error)
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update_expense/${editExpense.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editExpense)
            });
            if (response.status === 200) {
                toast.success('Expenses updated succesfully!');
                console.log(response);
                setEditExpense(null); //null here so the editexpense is also made null and the model condition becomes false and not shown in the UI too.
                fetchExpenses(userId); //fetches the latest value from backend.
            }
            else {
                toast.error('Failed to update expense');
            }
        }
        catch (error) {
            console.error("Error updating expenses", error)
        }
    };

    const handleDelete = async (Expenseid) => {
        if (window.confirm('Do you want this expense to be deleted?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/delete_expense/${Expenseid}/`, {
                    method: 'DELETE',
                });
                if (response.status === 200) {
                    toast.success('Expenses deleted succesfully!');
                    fetchExpenses(userId);
                }
                else {
                    toast.error('Failed to delete expense');
                }
            }
            catch (error) {
                console.error("Error deleting expenses", error)
            }
        }
    };

    const handleChange = (e) => {
        setEditExpense({ ...editExpense, [e.target.name]: e.target.value }); ///...formData to persist the previous value we set in the form field say we you add name then email then we want the name to be also included in the state variable 
    };
    const [editExpense, setEditExpense] = useState(null);

    const handleEdit = (expense) => {
        setEditExpense(expense);
    }

    return (
        <div className='container mt-5'>
            <div className='text-center mb-4'>
                <h2><i className='fas fa-tasks me-2'></i> Manage Expense</h2>
                <p className='text-muted'>Overview of your Expense</p>
            </div>

            <div>
                <table className='table table-striped table-bordered'>
                    <thead className='table-dark text-center'>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Cost(Rs.)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {expenses.length > 0 ? (
                            expenses.map((exp, index) => (
                                <tr key={exp.id}>
                                    <td>{index + 1}</td>
                                    <td>{exp.ExpenseDate}</td>
                                    <td>{exp.ExpenseItem}</td>
                                    <td>{exp.ExpenseCost}</td>
                                    <td>
                                        <button className='btn btn-sm btn-info me-2' onClick={() => handleEdit(exp)}><i className='fas fa-edit'></i></button>
                                        <button className='btn btn-sm btn-danger' onClick={() => handleDelete(exp.id)}><i className='fas fa-trash-alt'></i></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr> <td colSpan="5" className='text-center text-muted'><i className='fas fa-exclamation-circle me-2'></i>No expenses found</td> </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editExpense && (<div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title"><i className='fas fa-pen me-2'></i>Edit Expense</h5>
                            <button type="button" className="btn-close" onClick={() => setEditExpense(null)}>

                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='mb-3'>
                                <label className='form-label'>Expense date</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>
                                        <i className='fas fa-calendar-alt'></i>
                                    </span>
                                    <input type='Date' name='ExpenseDate' value={editExpense.ExpenseDate} className='form-control' onChange={handleChange} required />
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label className='form-label'>Expense Item</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>
                                        <i className='fas fa-shopping-cart'></i>
                                    </span>
                                    <input type='text' name='ExpenseItem' value={editExpense.ExpenseItem} className='form-control' onChange={handleChange} required placeholder='Enter expense item (e.g. Groceries, Milk)' />
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label className='form-label'>Expense Cost (Rs.)</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>
                                        <i className='fas fa-rupee-sign'></i>
                                    </span>
                                    <input type='number' name='ExpenseCost' value={editExpense.ExpenseCost} className='form-control' onChange={handleChange} required placeholder='Enter the cost of expense' />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save changes</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditExpense(null)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>)}
            <ToastContainer />
        </div>
    )
}
export default ManageExpense;