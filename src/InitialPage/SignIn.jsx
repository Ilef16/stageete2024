import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// Importation des images
import { Logo, GoogleIcon, FacebookIcon, LoginImage } from '../EntryFile/imagePath';

const SignInPage = () => {
    const [eye, setEye] = useState(true);
    const history = useHistory();

    const onEyeClick = () => setEye(!eye);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must not exceed 20 characters'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const login = async (data) => {
        try {
            const response = await fetch('https://cmc.crm-edi.info/paraMobile/api/public/api/login_check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('username', data.username); // Save username
                const roles = result.data?.roles || [];
                localStorage.setItem('userRoles', JSON.stringify(roles));

                const employeeResponse = await fetch('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/crm_users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${result.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const employeeResult = await employeeResponse.json();
                if (employeeResponse.ok) {
                    if (Array.isArray(employeeResult) && employeeResult.length > 0) {
                        const employee = employeeResult.find(emp => emp.username === data.username);
                        if (employee) {
                            const ematricule = employee.ematricule?.trim();
                            if (ematricule) {
                                localStorage.setItem('ematricule', ematricule);
                            } else {
                                console.error('Ematricule not found');
                                alert('Ematricule not found');
                            }
                        } else {
                            console.error('Employee not found');
                            alert('Employee not found');
                        }
                    } else {
                        console.error('No employee data found');
                        alert('No employee data found');
                    }
                } else {
                    console.error('Failed to fetch employee data:', employeeResult);
                    alert('Failed to fetch employee data');
                }

                // Redirect based on roles
                if (roles.includes('ROLE_ADMIN')) {
                    history.push('/dream-pos/dashboard');
                } else if (roles.includes('Role_MANAGER')) {
                    history.push('/dream-pos/product/crm');
                } else if (roles.includes('employee')) {
                    history.push('/dream-pos/demande/listeemployee');
                } else {
                    history.push('/dream-pos/dashboard');
                }
            } else {
                alert('Login failed: ' + (result.message || 'An unknown error occurred'));
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login error: ' + error.message);
        }
    };
    const buttonStyle = {
        backgroundColor: '#007bff', // Blue background
        color: '#fff', // White text
        border: 'none', // No border
        padding: '10px 285px', // Padding for the button
        borderRadius: '5px', // Rounded corners
        cursor: 'pointer', // Pointer cursor on hover
        transition: 'background-color 0.3s ease' // Smooth transition for hover effect
    };

    // Additional style for hover effect
    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = '#4169e1'; // Royal blue on hover
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = '#007bff'; // Original blue on mouse leave
    };

    const onSubmit = (data) => {
        console.log('Form Data:', data);
        login(data);
    };

    return (
        <div className="main-wrapper">
            <div className="account-content">
                <div className="login-wrapper">
                    <div className="login-content">
                        <div className="login-userset">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="login-logo">
                                    <img src={Logo} alt="logo" />
                                </div>
                                <div className="login-userheading">
                                    <h3>Log In</h3>
                                    <h4>Bienvenue</h4>
                                </div>
                                <div className="form-login">
                                    <label>Username</label>
                                    <div className={`form-addons ${errors.username ? 'is-invalid' : ''}`}>
                                        <input
                                            type="text"
                                            {...register('username')}
                                            placeholder="Enter your username"
                                        />
                                        {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                                    </div>
                                </div>
                                <div className="form-login">
                                    <label>Password</label>
                                    <div className="pass-group">
                                        <input
                                            type={eye ? "password" : "text"}
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Enter your password"
                                            {...register('password')}
                                        />
                                        <span onClick={onEyeClick} className={`fas toggle-password ${eye ? "fa-eye-slash" : "fa-eye"}`} />
                                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>
                                </div>
                                <div className="form-login">

                                </div>
                                <div className="form-login">
                                    <button
                                        type="submit"
                                     
                                        style={buttonStyle}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </form>



                        </div>
                    </div>
                    <div className="login-img">
                        <img src={LoginImage} alt="login" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
