import { useState } from "react";
import api from "@/services/axiosConfig";

const Student = () => {
    const [name, setName] = useState('');
    return (
    <>
        <p>Welcome, {name}, to your <span>Student Hub!</span></p>
    </>
    );
}
 
export default Student;