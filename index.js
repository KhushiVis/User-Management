
        const userForm = document.getElementById('userForm');
        const hiddenUserIdField = document.getElementById('hiddenUserId');
        const userIdField = document.getElementById('userId');
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        const createBtn = document.getElementById('createBtn');
        const updateBtn = document.getElementById('updateBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const userTableBody = document.getElementById('userTableBody');
        

        const userIdError = document.getElementById('userIdError');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        

        let users = JSON.parse(localStorage.getItem('users')) || [];
        let editMode = false;
        
        loadUserData();
        
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            userIdError.textContent = '';
            nameError.textContent = '';
            emailError.textContent = '';
            passwordError.textContent = '';
            
            if (!validateForm()) {
                return;
            }
            
            if (editMode) {
                updateUser();
            } else {
                createUser();
            }
        });
        
        updateBtn.addEventListener('click', function() {
            userIdError.textContent = '';
            nameError.textContent = '';
            emailError.textContent = '';
            passwordError.textContent = '';
            
            if (!validateForm()) {
                return;
            }
            
            updateUser();
        });
        
        cancelBtn.addEventListener('click', function() {
            exitEditMode();
        });
        
        function validateForm() {
            let isValid = true;
            
            if (userIdField.value.trim() === '') {
                userIdError.textContent = 'User ID is required';
                isValid = false;
            } else if (!editMode && users.some(user => user.userId === userIdField.value.trim())) {
                userIdError.textContent = 'This User ID already exists';
                isValid = false;
            } else if (editMode) {
                const currentId = hiddenUserIdField.value;
                const isDuplicate = users.some(user => 
                    user.userId === userIdField.value.trim() && user.id !== currentId
                );
                
                if (isDuplicate) {
                    userIdError.textContent = 'This User ID already exists';
                    isValid = false;
                }
            }
            
            if (nameField.value.trim() === '') {
                nameError.textContent = 'Name is required';
                isValid = false;
            }
            
            if (emailField.value.trim() === '') {
                emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!emailField.value.includes('@')) {
                emailError.textContent = 'Please enter a valid email';
                isValid = false;
            }
            
            if (!editMode && passwordField.value.trim() === '') {
                passwordError.textContent = 'Password is required';
                isValid = false;
            } else if (!editMode && passwordField.value.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                isValid = false;
            }
            
            return isValid;
        }
        
        function suggestUserId() {
            const randomId = Math.floor(1000 + Math.random() * 9000);
            return `USER-${randomId}`;
        }

        function createUser() {
            const newUser = {
                id: Date.now().toString(), 
                userId: userIdField.value.trim(),
                name: nameField.value.trim(),
                email: emailField.value.trim(),
                password: passwordField.value
            };
            
            users.push(newUser);
            saveUsers();
            userForm.reset();
            userIdField.value = suggestUserId(); 
            loadUserData();
        }
        
        function updateUser() {
            const id = hiddenUserIdField.value;
            const userIndex = users.findIndex(user => user.id === id);
            
            if (userIndex !== -1) {
                users[userIndex].userId = userIdField.value.trim();
                users[userIndex].name = nameField.value.trim();
                users[userIndex].email = emailField.value.trim();
                
                if (passwordField.value.trim() !== '') {
                    users[userIndex].password = passwordField.value;
                }
                
                saveUsers();
                exitEditMode();
                loadUserData();
            }
        }
        
        function deleteUser(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                users = users.filter(user => user.id !== id);
                saveUsers();
                loadUserData();
            }
        }
        
        function editUser(id) {
            const user = users.find(user => user.id === id);
            
            if (user) {
                editMode = true;
                
                hiddenUserIdField.value = user.id;
                userIdField.value = user.userId;
                nameField.value = user.name;
                emailField.value = user.email;
                passwordField.value = '';
                
                createBtn.style.display = 'none';
                updateBtn.style.display = 'inline-block';
                cancelBtn.style.display = 'inline-block';
                
                passwordField.removeAttribute('required');
            }
        }
        
        function exitEditMode() {
            editMode = false;
            hiddenUserIdField.value = '';
            userForm.reset();
            
            userIdField.value = suggestUserId();
            
            createBtn.style.display = 'inline-block';
            updateBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            
            passwordField.setAttribute('required', '');
        }
        
        function loadUserData() {
            userTableBody.innerHTML = '';
            
            if (users.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="4" style="text-align: center;">No users found</td>';
                userTableBody.appendChild(row);
                return;
            }
            
            users.forEach(user => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${user.userId}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="edit-btn" onclick="editUser('${user.id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
                    </td>
                `;
                
                userTableBody.appendChild(row);
            });
        }
        
        function saveUsers() {
            localStorage.setItem('users', JSON.stringify(users));
        }
        userIdField.value = suggestUserId();