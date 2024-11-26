import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
    });

    const apiBaseUrl = "https://gkiltdd.onrender.com/api/users"; // Thay bằng URL API của bạn.

    // Lấy danh sách users từ API
    useEffect(() => {
        const fetchUsers = async() => {
            try {
                const response = await axios.get(apiBaseUrl);
                setUsers(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Hiển thị modal thêm hoặc sửa user
    const handleShowModal = (user = null) => {
        setSelectedUser(user);
        setFormData(user ? {...user } : { name: "", email: "", role: "" });
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Xử lý thêm hoặc cập nhật user
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                // Cập nhật user
                const response = await axios.put(`${apiBaseUrl}/${selectedUser._id}`, formData);
                setUsers((prev) =>
                    prev.map((user) =>
                        user._id === selectedUser._id ? {...user, ...response.data } : user
                    )
                );
            } else {
                // Thêm user mới
                const response = await axios.post(apiBaseUrl, formData);
                setUsers((prev) => [...prev, response.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };

    // Xóa user
    const handleDelete = async(userId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                await axios.delete(`${apiBaseUrl}/${userId}`);
                setUsers((prev) => prev.filter((user) => user._id !== userId));
            } catch (error) {
                console.error("Lỗi khi xóa user:", error);
            }
        }
    };

    return ( <
        div className = "container mt-5" >
        <
        h1 className = "text-center mb-4" > Quản lý Users < /h1> <
        Button variant = "primary"
        onClick = {
            () => handleShowModal()
        }
        className = "mb-3" >
        Thêm User <
        /Button> <
        Table striped bordered hover >
        <
        thead >
        <
        tr >
        <
        th > # < /th> <
        th > Name < /th> <
        th > Email < /th> <
        th > Role < /th> <
        th > Actions < /th> < /
        tr > <
        /thead> <
        tbody > {
            users.map((user, index) => ( <
                tr key = { user._id } >
                <
                td > { index + 1 } < /td> <
                td > { user.name } < /td> <
                td > { user.email } < /td> <
                td > { user.role } < /td> <
                td >
                <
                Button variant = "warning"
                className = "me-2"
                onClick = {
                    () => handleShowModal(user)
                } >
                Sửa <
                /Button> <
                Button variant = "danger"
                onClick = {
                    () => handleDelete(user._id)
                } >
                Xóa <
                /Button> < /
                td > <
                /tr>
            ))
        } <
        /tbody> < /
        Table >

        { /* Modal thêm/sửa user */ } <
        Modal show = { showModal }
        onHide = { handleCloseModal } >
        <
        Modal.Header closeButton >
        <
        Modal.Title > { selectedUser ? "Cập nhật User" : "Thêm User mới" } <
        /Modal.Title> < /
        Modal.Header > <
        Modal.Body >
        <
        Form onSubmit = { handleSubmit } >
        <
        Form.Group className = "mb-3" >
        <
        Form.Label > Name < /Form.Label> <
        Form.Control type = "text"
        value = { formData.name }
        onChange = {
            (e) =>
            setFormData({...formData, name: e.target.value })
        }
        /> < /
        Form.Group > <
        Form.Group className = "mb-3" >
        <
        Form.Label > Email < /Form.Label> <
        Form.Control type = "email"
        value = { formData.email }
        onChange = {
            (e) =>
            setFormData({...formData, email: e.target.value })
        }
        /> < /
        Form.Group > <
        Form.Group className = "mb-3" >
        <
        Form.Label > Role < /Form.Label> <
        Form.Control type = "text"
        value = { formData.role }
        onChange = {
            (e) =>
            setFormData({...formData, role: e.target.value })
        }
        /> < /
        Form.Group > <
        Button variant = "primary"
        type = "submit" > { selectedUser ? "Cập nhật" : "Thêm" } <
        /Button> < /
        Form > <
        /Modal.Body> < /
        Modal > <
        /div>
    );
};

export default AdminUser;