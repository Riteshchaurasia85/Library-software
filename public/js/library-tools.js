
    function launchTool(toolName) {
        const modal = document.getElementById('toolModal');
        const contentArea = document.getElementById('toolContentArea');

        let toolHTML = '';

        switch(toolName) {
            case 'whiteboard':
                toolHTML = `
                    <h2>Digital Whiteboard</h2>
                    <div class="whiteboard-wrapper">
                        <div class="whiteboard-toolbar">
                            <div class="toolbar-group">
                                <button class="tool-btn-small active" data-tool="pen" title="Pen (P)"><i class="ri-pen-nib-line"></i></button>
                                <button class="tool-btn-small" data-tool="eraser" title="Eraser (E)"><i class="ri-eraser-line"></i></button>
                                <button class="tool-btn-small" data-tool="line" title="Line"><i class="ri-line-height"></i></button>
                                <button class="tool-btn-small" data-tool="rectangle" title="Rectangle"><i class="ri-layout-2-line"></i></button>
                                <button class="tool-btn-small" data-tool="circle" title="Circle"><i class="ri-contrast-2-line"></i></button>
                                <button class="tool-btn-small" data-tool="text" title="Text"><i class="ri-text-block"></i></button>
                            </div>
                            <div class="toolbar-group">
                                <label>Color: <input type="color" id="penColor" value="#000000" title="Pen Color"></label>
                                <label>Size: <input type="range" id="penSize" min="1" max="50" value="3" title="Pen Size"></label>
                            </div>
                            <div class="toolbar-group">
                                <button class="tool-btn-small" onclick="undoDrawing()" title="Undo"><i class="ri-arrow-go-back-line"></i></button>
                                <button class="tool-btn-small" onclick="redoDrawing()" title="Redo"><i class="ri-arrow-go-forward-line"></i></button>
                                <button class="tool-btn-small" onclick="clearWhiteboard()" title="Clear All"><i class="ri-delete-bin-line"></i></button>
                            </div>
                            <div class="toolbar-group">
                                <input type="text" id="whiteboardTitle" placeholder="Enter whiteboard name..." style="padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                                <button class="tool-btn-small" onclick="saveWhiteboard()" title="Save"><i class="ri-save-line"></i></button>
                                <button class="tool-btn-small" onclick="loadWhiteboard()" title="Load"><i class="ri-download-2-line"></i></button>
                                <button class="tool-btn-small" onclick="downloadWhiteboard()" title="Download"><i class="ri-file-download-line"></i></button>
                            </div>
                        </div>
                        <canvas id="whiteboardCanvas" width="1200" height="700" style="border: 2px solid #ddd; border-radius: 8px; cursor: crosshair; background: white; display: block; margin: 15px 0;"></canvas>
                        <div id="whiteboardHistory" style="margin-top: 20px;"></div>
                    </div>
                `;
                break;

            case 'video-lectures':
                toolHTML = `
                    <h2>Video Lectures</h2>
                    <div class="video-container">
                        <div class="video-upload-form">
                            <label>Upload or Record Lecture:</label>
                            <input type="file" accept="video/*" id="videoFile" style="margin: 10px 0;">
                            <button onclick="uploadVideo()">Upload Video</button>
                            <button onclick="startRecording()">Start Recording</button>
                            <button id="stopRecBtn" onclick="stopRecording()" style="display:none;">Stop Recording</button>
                        </div>
                        <div class="video-player" style="margin-top: 20px;">
                            <video id="videoPlayer" width="100%" height="400" controls style="background: #000; border-radius: 8px;"></video>
                        </div>
                        <div id="recordingsList" style="margin-top: 20px;"></div>
                    </div>
                `;
                break;

            case 'presentations':
                toolHTML = `
                    <h2>Presentations - PowerPoint Editor</h2>
                    <div class="presentations-container">
                        <!-- Main Toolbar -->
                        <div class="ppt-main-toolbar">
                            <div class="toolbar-row">
                                <div class="toolbar-group">
                                    <button class="ppt-btn" onclick="createNewPresentation()" title="New"><i class="ri-file-add-line"></i> New</button>
                                    <input type="file" id="presentationFile" accept=".pptx,.ppt,.pdf" style="display:none;" onchange="uploadPresentation()">
                                    <button class="ppt-btn" onclick="document.getElementById('presentationFile').click()" title="Upload"><i class="ri-upload-2-line"></i> Upload</button>
                                    <button class="ppt-btn" onclick="downloadPresentation()" title="Download"><i class="ri-download-2-line"></i> Download</button>
                                </div>
                                <div class="toolbar-group">
                                    <button class="ppt-btn" onclick="addSlide()" title="Add Slide"><i class="ri-add-line"></i> Add Slide</button>
                                    <button class="ppt-btn" onclick="deleteSlide()" title="Delete"><i class="ri-delete-bin-line"></i> Delete</button>
                                    <button class="ppt-btn" onclick="duplicateSlide()" title="Duplicate"><i class="ri-file-copy-line"></i> Duplicate</button>
                                </div>
                                <div class="toolbar-group">
                                    <button class="ppt-btn" onclick="addTextBox()" title="Add Text"><i class="ri-text-block"></i> Add Text</button>
                                    <button class="ppt-btn" onclick="addShape('rectangle')" title="Rectangle"><i class="ri-layout-2-line"></i> Rectangle</button>
                                    <button class="ppt-btn" onclick="addShape('circle')" title="Circle"><i class="ri-contrast-2-line"></i> Circle</button>
                                    <button class="ppt-btn" onclick="addImage()" title="Image"><i class="ri-image-add-line"></i> Image</button>
                                </div>
                                <div class="toolbar-group">
                                    <label style="display: flex; align-items: center; gap: 5px;">Font: <select id="fontFamily" onchange="updateTextFormat()" style="padding: 5px;">
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Verdana">Verdana</option>
                                    </select></label>
                                    <label style="display: flex; align-items: center; gap: 5px;">Size: <input type="number" id="fontSize" min="8" max="72" value="24" onchange="updateTextFormat()" style="width: 50px; padding: 5px;"></label>
                                    <label title="Text Color"><input type="color" id="textColor" value="#000000" onchange="updateTextFormat()" style="cursor: pointer; width: 40px; height: 35px; border: none; border-radius: 4px;"></label>
                                </div>
                                <div class="toolbar-group">
                                    <button class="ppt-btn-icon" onclick="toggleBold()" title="Bold"><i class="ri-bold"></i></button>
                                    <button class="ppt-btn-icon" onclick="toggleItalic()" title="Italic"><i class="ri-italic"></i></button>
                                    <button class="ppt-btn-icon" onclick="toggleUnderline()" title="Underline"><i class="ri-underline"></i></button>
                                </div>
                                <div class="toolbar-group">
                                    <label style="display: flex; align-items: center; gap: 5px;">BG Color: <input type="color" id="slideBg" value="#ffffff" onchange="changeSlideBg()" style="cursor: pointer; width: 40px; height: 35px; border: none; border-radius: 4px;"></label>
                                </div>
                                <div class="toolbar-group">
                                    <button class="ppt-btn" onclick="startSlideshow()" title="Slideshow"><i class="ri-play-line"></i> Slideshow</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Main Editor Area -->
                        <div class="ppt-editor-centered">
                            <!-- Slide Thumbnails Left Panel -->
                            <div class="slides-panel-left">
                                <h3>Slides</h3>
                                <div id="slidesList" class="slides-list"></div>
                            </div>
                            
                            <!-- Center Canvas Area -->
                            <div class="editor-center-area">
                                <div id="slideCanvas" class="slide-canvas" ondrop="dropElement(event)" ondragover="allowDrop(event)">
                                    <div class="slide-placeholder">
                                        <p>📌 Click "Add Slide" to start</p>
                                    </div>
                                </div>
                                
                                <!-- Navigation Controls -->
                                <div class="slide-nav-bottom">
                                    <button class="nav-btn" onclick="previousSlide()" title="Previous"><i class="ri-arrow-left-line"></i></button>
                                    <span id="slideCounter" class="slide-counter">0 / 0</span>
                                    <button class="nav-btn" onclick="nextSlide()" title="Next"><i class="ri-arrow-right-line"></i></button>
                                </div>
                            </div>
                            
                            <!-- Properties Right Panel -->
                            <div class="properties-panel-right">
                                <h3>Properties</h3>
                                <div id="elementProperties" class="properties-content">
                                    <p>Select element</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'code-editor':
                toolHTML = `
                    <h2>Code Editor</h2>
                    <div class="code-editor-container">
                        <div class="code-controls">
                            <select id="languageSelect" onchange="updateLanguage()">
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                            </select>
                            <button onclick="runCode()">Run Code</button>
                        </div>
                        <textarea id="codeEditor" placeholder="Write your code here..." style="width: 100%; height: 300px; padding: 10px; font-family: monospace; border: 1px solid #ddd;"></textarea>
                        <div id="codeOutput" style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px; display: none;"></div>
                    </div>
                `;
                break;

            case 'catalog-search':
                toolHTML = `
                    <h2>Catalog Search</h2>
                    <div class="catalog-search-container">
                        <div class="search-controls">
                            <input type="text" id="searchQuery" placeholder="Search books, journals, resources..." style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <div style="margin: 10px 0;">
                                <label>Filter by:</label>
                                <select id="catalogFilter" style="margin: 0 10px;">
                                    <option value="all">All Resources</option>
                                    <option value="books">Books</option>
                                    <option value="journals">Journals</option>
                                    <option value="ebooks">E-Books</option>
                                    <option value="databases">Databases</option>
                                </select>
                                <button onclick="searchCatalog()">Search</button>
                            </div>
                        </div>
                        <div id="searchResults" style="margin-top: 20px;"></div>
                    </div>
                `;
                break;

            case 'citation-manager':
                toolHTML = `
                    <h2>Citation Manager</h2>
                    <div class="citation-manager-container">
                        <div class="citation-controls">
                            <select id="citationStyle" onchange="updateCitationStyle()">
                                <option value="apa">APA</option>
                                <option value="mla">MLA</option>
                                <option value="chicago">Chicago</option>
                                <option value="harvard">Harvard</option>
                            </select>
                            <button onclick="addNewCitation()">Add Citation</button>
                        </div>
                        <div class="citation-form" style="margin-top: 20px;">
                            <input type="text" placeholder="Author Name" id="citationAuthor" style="display: block; width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd;">
                            <input type="text" placeholder="Title" id="citationTitle" style="display: block; width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd;">
                            <input type="text" placeholder="Publisher/Source" id="citationSource" style="display: block; width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd;">
                            <input type="text" placeholder="Year" id="citationYear" style="display: block; width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd;">
                            <button onclick="generateCitation()">Generate Citation</button>
                        </div>
                        <div id="citationOutput" style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px;"></div>
                    </div>
                `;
                break;

            case 'collaboration-space':
                toolHTML = `
                    <h2>Collaboration Space</h2>
                    <div class="collaboration-container">
                        <div class="collaboration-controls">
                            <button onclick="createCollaborationGroup()">Create New Group</button>
                            <button onclick="joinCollaborationGroup()">Join Existing Group</button>
                        </div>
                        <div class="active-groups" style="margin-top: 20px;">
                            <h3>Active Collaborations</h3>
                            <div id="collaborationGroups" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;"></div>
                        </div>
                        <div class="collaboration-chat" style="margin-top: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; height: 300px; overflow-y: auto;">
                            <div id="chatMessages" style="min-height: 250px;"></div>
                            <input type="text" id="chatMessage" placeholder="Type message..." style="width: 100%; padding: 8px; border: 1px solid #ddd; margin-top: 10px;">
                        </div>
                    </div>
                `;
                break;

            case 'resource-booking':
                toolHTML = `
                    <h2>Resource Booking</h2>
                    <div class="resource-booking-container">
                        <div class="booking-controls">
                            <label>Select Resource:</label>
                            <select id="resourceType" style="margin: 10px 0; padding: 8px; border: 1px solid #ddd;">
                                <option value="study-room">Study Room</option>
                                <option value="computer-lab">Computer Lab</option>
                                <option value="meeting-room">Meeting Room</option>
                                <option value="projector">Projector</option>
                                <option value="printer">Printer</option>
                            </select>
                            <div style="margin: 10px 0;">
                                <label>Select Date & Time:</label>
                                <input type="datetime-local" id="bookingDateTime" style="display: block; padding: 8px; border: 1px solid #ddd; margin: 5px 0;">
                                <input type="number" placeholder="Duration (hours)" id="bookingDuration" min="1" max="8" style="display: block; padding: 8px; border: 1px solid #ddd; margin: 5px 0;">
                            </div>
                            <button onclick="bookResource()">Book Resource</button>
                        </div>
                        <div class="booking-list" style="margin-top: 20px;">
                            <h3>Your Bookings</h3>
                            <div id="bookingsList"></div>
                        </div>
                    </div>
                `;
                break;

            default:
                toolHTML = '<p>Tool not found</p>';
        }

        contentArea.innerHTML = toolHTML;
        modal.style.display = 'block';

        // Initialize tool-specific functionality
        if(toolName === 'whiteboard') {
            initializeWhiteboard();
        } else if(toolName === 'presentations') {
            setTimeout(() => {
                initPresentation();
                addSlide();
            }, 100);
        }
    }

    function closeTool() {
        document.getElementById('toolModal').style.display = 'none';
    }

    // Whiteboard Functions
    let whiteboardState = {
        currentTool: 'pen',
        isDrawing: false,
        startX: 0,
        startY: 0,
        history: [],
        historyStep: -1
    };

    function initializeWhiteboard() {
        const canvas = document.getElementById('whiteboardCanvas');
        const ctx = canvas.getContext('2d');
        
        // Add initial canvas state to history
        whiteboardState.history.push(canvas.toDataURL());
        whiteboardState.historyStep = 0;
        
        // Tool selection
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                whiteboardState.currentTool = this.dataset.tool;
            });
        });

        canvas.addEventListener('mousedown', (e) => {
            whiteboardState.isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            whiteboardState.startX = e.clientX - rect.left;
            whiteboardState.startY = e.clientY - rect.top;
            
            if (whiteboardState.currentTool !== 'line' && whiteboardState.currentTool !== 'rectangle' && whiteboardState.currentTool !== 'circle') {
                ctx.beginPath();
                ctx.moveTo(whiteboardState.startX, whiteboardState.startY);
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!whiteboardState.isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            const penColor = document.getElementById('penColor').value;
            const penSize = document.getElementById('penSize').value;
            
            ctx.strokeStyle = penColor;
            ctx.fillStyle = penColor;
            ctx.lineWidth = penSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            if (whiteboardState.currentTool === 'pen') {
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            } else if (whiteboardState.currentTool === 'eraser') {
                ctx.clearRect(currentX - penSize/2, currentY - penSize/2, penSize, penSize);
            }
        });

        canvas.addEventListener('mouseup', (e) => {
            if (!whiteboardState.isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
            
            const penColor = document.getElementById('penColor').value;
            const penSize = document.getElementById('penSize').value;
            
            ctx.strokeStyle = penColor;
            ctx.fillStyle = penColor;
            ctx.lineWidth = penSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            if (whiteboardState.currentTool === 'line') {
                ctx.beginPath();
                ctx.moveTo(whiteboardState.startX, whiteboardState.startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            } else if (whiteboardState.currentTool === 'rectangle') {
                const width = endX - whiteboardState.startX;
                const height = endY - whiteboardState.startY;
                ctx.strokeRect(whiteboardState.startX, whiteboardState.startY, width, height);
            } else if (whiteboardState.currentTool === 'circle') {
                const radius = Math.sqrt(Math.pow(endX - whiteboardState.startX, 2) + Math.pow(endY - whiteboardState.startY, 2));
                ctx.beginPath();
                ctx.arc(whiteboardState.startX, whiteboardState.startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (whiteboardState.currentTool === 'text') {
                const text = prompt('Enter text:');
                if (text) {
                    ctx.font = `${penSize * 4}px Arial`;
                    ctx.fillStyle = penColor;
                    ctx.fillText(text, whiteboardState.startX, whiteboardState.startY);
                }
            }
            
            whiteboardState.isDrawing = false;
            
            // Add to history
            whiteboardState.historyStep++;
            if (whiteboardState.historyStep < whiteboardState.history.length) {
                whiteboardState.history.length = whiteboardState.historyStep;
            }
            whiteboardState.history.push(canvas.toDataURL());
        });

        canvas.addEventListener('mouseout', () => {
            whiteboardState.isDrawing = false;
        });
        
        loadWhiteboardHistory();
    }

    function undoDrawing() {
        const canvas = document.getElementById('whiteboardCanvas');
        const ctx = canvas.getContext('2d');
        
        if (whiteboardState.historyStep > 0) {
            whiteboardState.historyStep--;
            const img = new Image();
            img.src = whiteboardState.history[whiteboardState.historyStep];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    function redoDrawing() {
        const canvas = document.getElementById('whiteboardCanvas');
        const ctx = canvas.getContext('2d');
        
        if (whiteboardState.historyStep < whiteboardState.history.length - 1) {
            whiteboardState.historyStep++;
            const img = new Image();
            img.src = whiteboardState.history[whiteboardState.historyStep];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    function clearWhiteboard() {
        if (confirm('Are you sure you want to clear the entire whiteboard?')) {
            const canvas = document.getElementById('whiteboardCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            whiteboardState.history = [canvas.toDataURL()];
            whiteboardState.historyStep = 0;
        }
    }

    function downloadWhiteboard() {
        const canvas = document.getElementById('whiteboardCanvas');
        const link = document.createElement('a');
        const title = document.getElementById('whiteboardTitle').value || 'whiteboard';
        link.href = canvas.toDataURL();
        link.download = title + '-' + new Date().toISOString().slice(0,10) + '.png';
        link.click();
    }

    function saveWhiteboard() {
        const canvas = document.getElementById('whiteboardCanvas');
        const title = document.getElementById('whiteboardTitle').value || 'Untitled-' + new Date().getTime();
        
        const whiteboardData = {
            title: title,
            imageData: canvas.toDataURL(),
            drawingData: JSON.stringify(whiteboardState.history)
        };
        
        fetch('/api/whiteboard/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(whiteboardData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Whiteboard saved successfully! ID: ' + data.id);
                loadWhiteboardHistory();
            } else {
                alert('Error saving whiteboard: ' + data.message);
            }
        })
        .catch(err => alert('Error: ' + err.message));
    }

    function loadWhiteboard() {
        fetch('/api/whiteboard/list')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.whiteboards.length > 0) {
                let listHTML = 'Select a whiteboard to load:\n\n';
                data.whiteboards.forEach((wb, index) => {
                    listHTML += (index + 1) + '. ' + wb.title + ' (' + new Date(wb.updatedAt).toLocaleDateString() + ')\n';
                });
                listHTML += '\n(Enter the number to load)';
                
                const choice = prompt(listHTML);
                if (choice && parseInt(choice) > 0 && parseInt(choice) <= data.whiteboards.length) {
                    const wb = data.whiteboards[parseInt(choice) - 1];
                    fetch('/api/whiteboard/' + wb._id)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            const canvas = document.getElementById('whiteboardCanvas');
                            const ctx = canvas.getContext('2d');
                            const img = new Image();
                            img.src = data.whiteboard.imageData;
                            img.onload = () => {
                                ctx.drawImage(img, 0, 0);
                                document.getElementById('whiteboardTitle').value = data.whiteboard.title;
                                whiteboardState.history = JSON.parse(data.whiteboard.drawingData);
                                whiteboardState.historyStep = whiteboardState.history.length - 1;
                            };
                        }
                    });
                }
            } else {
                alert('No saved whiteboards found');
            }
        })
        .catch(err => alert('Error loading whiteboards: ' + err.message));
    }

    function loadWhiteboardHistory() {
        fetch('/api/whiteboard/list')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.whiteboards.length > 0) {
                const historyDiv = document.getElementById('whiteboardHistory');
                let html = '<h4>Recent Whiteboards:</h4><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">';
                data.whiteboards.slice(0, 6).forEach(wb => {
                    html += `<div style="padding: 10px; background: #f5f5f5; border-radius: 5px; cursor: pointer; border: 1px solid #ddd;">
                        <strong>${wb.title}</strong><br>
                        <small>${new Date(wb.updatedAt).toLocaleDateString()}</small>
                        <button onclick="deleteWhiteboardItem('${wb._id}')" style="margin-top: 5px; padding: 3px 8px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">Delete</button>
                    </div>`;
                });
                html += '</div>';
                historyDiv.innerHTML = html;
            }
        });
    }

    function deleteWhiteboardItem(id) {
        if (confirm('Are you sure you want to delete this whiteboard?')) {
            fetch('/api/whiteboard/' + id, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Whiteboard deleted successfully');
                    loadWhiteboardHistory();
                }
            });
        }
    }

    // Video Recording Functions
    let mediaRecorder;
    let recordedChunks = [];

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (e) => {
                    if(e.data.size > 0) {
                        recordedChunks.push(e.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const videoUrl = URL.createObjectURL(blob);
                    document.getElementById('videoPlayer').src = videoUrl;
                    recordedChunks = [];
                };
                mediaRecorder.start();
                document.getElementById('stopRecBtn').style.display = 'inline-block';
                alert('Recording started!');
            })
            .catch(err => alert('Error accessing camera: ' + err.message));
    }

    function stopRecording() {
        if(mediaRecorder) {
            mediaRecorder.stop();
            document.getElementById('stopRecBtn').style.display = 'none';
            alert('Recording stopped!');
        }
    }

    function uploadVideo() {
        const fileInput = document.getElementById('videoFile');
        if(fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const videoUrl = URL.createObjectURL(file);
            document.getElementById('videoPlayer').src = videoUrl;
            alert('Video loaded successfully!');
        }
    }

    // Code Editor Functions
    function runCode() {
        const code = document.getElementById('codeEditor').value;
        const language = document.getElementById('languageSelect').value;
        const outputDiv = document.getElementById('codeOutput');

        try {
            if(language === 'javascript' || language === 'html') {
                const result = eval(code);
                outputDiv.innerHTML = '<strong>Output:</strong> ' + (result || 'Code executed successfully');
                outputDiv.style.display = 'block';
            } else {
                outputDiv.innerHTML = '<strong>Note:</strong> ' + language + ' code execution requires a backend. Check console for details.';
                outputDiv.style.display = 'block';
            }
        } catch(e) {
            outputDiv.innerHTML = '<strong style="color: red;">Error:</strong> ' + e.message;
            outputDiv.style.display = 'block';
        }
    }

    // Citation Functions
    function generateCitation() {
        const author = document.getElementById('citationAuthor').value;
        const title = document.getElementById('citationTitle').value;
        const source = document.getElementById('citationSource').value;
        const year = document.getElementById('citationYear').value;
        const style = document.getElementById('citationStyle').value;

        let citation = '';
        switch(style) {
            case 'apa':
                citation = `${author} (${year}). ${title}. ${source}.`;
                break;
            case 'mla':
                citation = `${author}. "${title}." ${source}, ${year}.`;
                break;
            case 'chicago':
                citation = `${author}. ${title}. ${source}, ${year}.`;
                break;
            case 'harvard':
                citation = `${author} ${year}. ${title}. Available at: ${source}.`;
                break;
        }

        document.getElementById('citationOutput').innerHTML = '<strong>Generated Citation:</strong><br>' + citation;
    }

    function updateCitationStyle() {
        generateCitation();
    }

    // Resource Booking Functions
    function bookResource() {
        const resource = document.getElementById('resourceType').value;
        const dateTime = document.getElementById('bookingDateTime').value;
        const duration = document.getElementById('bookingDuration').value;

        if(!dateTime || !duration) {
            alert('Please fill all fields');
            return;
        }

        const booking = {
            resource,
            dateTime,
            duration,
            id: Date.now()
        };

        let bookings = JSON.parse(localStorage.getItem('resourceBookings')) || [];
        bookings.push(booking);
        localStorage.setItem('resourceBookings', JSON.stringify(bookings));

        alert('Resource booked successfully!');
        displayBookings();
    }

    function displayBookings() {
        let bookings = JSON.parse(localStorage.getItem('resourceBookings')) || [];
        const bookingsList = document.getElementById('bookingsList');
        bookingsList.innerHTML = '';
        
        bookings.forEach(booking => {
            const bookingDiv = document.createElement('div');
            bookingDiv.style.cssText = 'padding: 10px; margin: 10px 0; background: #e8f5e9; border-radius: 5px;';
            bookingDiv.innerHTML = `
                <strong>${booking.resource}</strong> - ${booking.dateTime} (${booking.duration}h)
                <button onclick="cancelBooking(${booking.id})" style="float: right; padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">Cancel</button>
            `;
            bookingsList.appendChild(bookingDiv);
        });
    }

    function cancelBooking(id) {
        let bookings = JSON.parse(localStorage.getItem('resourceBookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('resourceBookings', JSON.stringify(bookings));
        displayBookings();
    }

    // Catalog Search
    function searchCatalog() {
        const query = document.getElementById('searchQuery').value;
        const filter = document.getElementById('catalogFilter').value;
        const resultsDiv = document.getElementById('searchResults');

        const mockResults = [
            { title: 'Introduction to Data Science', author: 'John Doe', type: 'ebook', available: true },
            { title: 'Advanced JavaScript', author: 'Jane Smith', type: 'book', available: true },
            { title: 'Database Design Patterns', author: 'Bob Johnson', type: 'journal', available: false }
        ];

        const filtered = mockResults.filter(r => 
            (r.title.toLowerCase().includes(query.toLowerCase()) || query === '') &&
            (filter === 'all' || filter === r.type)
        );

        resultsDiv.innerHTML = filtered.map(r => `
            <div style="padding: 10px; margin: 10px 0; background: #f5f5f5; border-left: 4px solid ${r.available ? '#4caf50' : '#f44336'}; border-radius: 3px;">
                <strong>${r.title}</strong><br>
                Author: ${r.author}<br>
                Type: ${r.type}<br>
                Status: <span style="color: ${r.available ? 'green' : 'red'}">${r.available ? 'Available' : 'Not Available'}</span>
                <button onclick="reserveResource('${r.title}')" style="margin-top: 10px; padding: 5px 10px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">Reserve</button>
            </div>
        `).join('');
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('toolModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // PowerPoint Presentation Editor Functions
    let presentationState = {
        slides: [],
        currentSlide: -1,
        selectedElement: null,
        isDragging: false,
        dragStart: { x: 0, y: 0 }
    };

    function initPresentation() {
        presentationState.slides = [];
        presentationState.currentSlide = -1;
        updateSlidesList();
        updateSlideCounter();
    }

    function createNewPresentation() {
        if(confirm('Create a new presentation? Current work will be lost.')) {
            initPresentation();
            addSlide();
        }
    }

    function addSlide() {
        const slideNum = presentationState.slides.length + 1;
        const newSlide = {
            id: 'slide-' + Date.now(),
            number: slideNum,
            title: 'Slide ' + slideNum,
            bgColor: '#ffffff',
            elements: []
        };
        presentationState.slides.push(newSlide);
        presentationState.currentSlide = presentationState.slides.length - 1;
        updateSlidesList();
        renderSlide(presentationState.currentSlide);
        updateSlideCounter();
    }

    function deleteSlide() {
        if(presentationState.slides.length <= 1) {
            alert('Cannot delete the last slide');
            return;
        }
        if(confirm('Delete this slide?')) {
            presentationState.slides.splice(presentationState.currentSlide, 1);
            presentationState.currentSlide = Math.max(0, presentationState.currentSlide - 1);
            updateSlidesList();
            renderSlide(presentationState.currentSlide);
            updateSlideCounter();
        }
    }

    function duplicateSlide() {
        if(presentationState.currentSlide < 0) {
            alert('No slide selected');
            return;
        }
        const currentSlide = presentationState.slides[presentationState.currentSlide];
        const newSlide = JSON.parse(JSON.stringify(currentSlide));
        newSlide.id = 'slide-' + Date.now();
        newSlide.number = presentationState.slides.length + 1;
        presentationState.slides.push(newSlide);
        presentationState.currentSlide = presentationState.slides.length - 1;
        updateSlidesList();
        renderSlide(presentationState.currentSlide);
        updateSlideCounter();
    }

    function updateSlidesList() {
        const slidesList = document.getElementById('slidesList');
        slidesList.innerHTML = '';
        
        presentationState.slides.forEach((slide, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'slide-thumbnail' + (index === presentationState.currentSlide ? ' active' : '');
            thumb.onclick = () => {
                presentationState.currentSlide = index;
                updateSlidesList();
                renderSlide(index);
            };
            thumb.innerHTML = `
                <div style="background: ${slide.bgColor}; height: 100px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999;">
                    <span>${slide.title}</span>
                </div>
                <div class="slide-thumbnail-label">Slide ${slide.number}</div>
            `;
            slidesList.appendChild(thumb);
        });
    }

    function renderSlide(slideIndex) {
        if(slideIndex < 0 || slideIndex >= presentationState.slides.length) return;
        
        const slide = presentationState.slides[slideIndex];
        const canvas = document.getElementById('slideCanvas');
        
        canvas.innerHTML = '';
        
        // Create slide workspace (fixed 16:9 ratio)
        const slideWorkspace = document.createElement('div');
        slideWorkspace.style.cssText = `
            position: relative;
            width: 960px;
            height: 540px;
            background: ${slide.bgColor};
            border: 3px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            overflow: hidden;
        `;
        
        slide.elements.forEach(elem => {
            const elDiv = document.createElement('div');
            elDiv.className = 'slide-element';
            elDiv.id = 'elem-' + elem.id;
            elDiv.style.position = 'absolute';
            elDiv.style.left = elem.x + 'px';
            elDiv.style.top = elem.y + 'px';
            elDiv.style.width = elem.width + 'px';
            elDiv.style.height = elem.height + 'px';
            elDiv.style.fontFamily = elem.fontFamily || 'Arial';
            elDiv.style.fontSize = (elem.fontSize || 24) + 'px';
            elDiv.style.color = elem.textColor || '#000';
            elDiv.style.backgroundColor = elem.bgColor || 'transparent';
            
            if(elem.isBold) elDiv.style.fontWeight = 'bold';
            if(elem.isItalic) elDiv.style.fontStyle = 'italic';
            if(elem.isUnderline) elDiv.style.textDecoration = 'underline';
            
            if(elem.type === 'text') {
                elDiv.innerHTML = elem.content;
                elDiv.style.whiteSpace = 'pre-wrap';
                elDiv.style.wordWrap = 'break-word';
                elDiv.contentEditable = true;
                elDiv.onblur = () => {
                    elem.content = elDiv.innerHTML;
                };
            } else if(elem.type === 'rectangle') {
                elDiv.style.border = '2px solid #333';
            } else if(elem.type === 'circle') {
                elDiv.style.border = '2px solid #333';
                elDiv.style.borderRadius = '50%';
            } else if(elem.type === 'image') {
                elDiv.innerHTML = '<img src="' + elem.src + '" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">';
            }
            
            elDiv.onclick = (e) => {
                e.stopPropagation();
                selectElement(elem, elDiv);
            };
            
            elDiv.onmousedown = (e) => {
                if(e.buttons === 1) startDrag(e, elem);
            };
            
            slideWorkspace.appendChild(elDiv);
        });
        
        canvas.appendChild(slideWorkspace);
    }

    function addTextBox() {
        if(presentationState.currentSlide < 0) {
            alert('Please create a slide first');
            return;
        }
        
        const slide = presentationState.slides[presentationState.currentSlide];
        const newElement = {
            id: 'elem-' + Date.now(),
            type: 'text',
            content: 'Enter text here',
            x: 50,
            y: 50,
            width: 300,
            height: 100,
            fontSize: 24,
            fontFamily: 'Arial',
            textColor: '#000',
            bgColor: '#f0f0f0',
            isBold: false,
            isItalic: false,
            isUnderline: false
        };
        slide.elements.push(newElement);
        renderSlide(presentationState.currentSlide);
    }

    function addShape(shapeType) {
        if(presentationState.currentSlide < 0) {
            alert('Please create a slide first');
            return;
        }
        
        const slide = presentationState.slides[presentationState.currentSlide];
        const newElement = {
            id: 'elem-' + Date.now(),
            type: shapeType,
            x: 100,
            y: 100,
            width: 150,
            height: 100,
            bgColor: '#3170d4'
        };
        slide.elements.push(newElement);
        renderSlide(presentationState.currentSlide);
    }

    function addImage() {
        if(presentationState.currentSlide < 0) {
            alert('Please create a slide first');
            return;
        }
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const slide = presentationState.slides[presentationState.currentSlide];
                const newElement = {
                    id: 'elem-' + Date.now(),
                    type: 'image',
                    src: event.target.result,
                    x: 100,
                    y: 100,
                    width: 300,
                    height: 200
                };
                slide.elements.push(newElement);
                renderSlide(presentationState.currentSlide);
            };
            reader.readAsDataURL(file);
        };
        fileInput.click();
    }

    function selectElement(elem, elDiv) {
        if(presentationState.selectedElement) {
            document.getElementById('elem-' + presentationState.selectedElement.id).classList.remove('selected');
        }
        presentationState.selectedElement = elem;
        elDiv.classList.add('selected');
        
        const props = document.getElementById('elementProperties');
        props.innerHTML = `
            <div style="font-size: 12px; color: #333; line-height: 1.6;">
                <strong>${elem.type}</strong><br>
                Position: (${elem.x}, ${elem.y})<br>
                Size: ${elem.width} x ${elem.height}<br>
                ${elem.type === 'text' ? 'Font: ' + (elem.fontFamily || 'Arial') + ' ' + (elem.fontSize || 24) + 'px<br>' : ''}
                ${elem.type === 'text' ? 'Color: <input type="color" value="' + (elem.textColor || '#000') + '" onchange="updateElementColor(this.value)">' : ''}
            </div>
        `;
    }

    function startDrag(e, elem) {
        presentationState.isDragging = true;
        presentationState.dragStart = { x: e.clientX, y: e.clientY };
        const elemPos = { x: elem.x, y: elem.y };
        
        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - presentationState.dragStart.x;
            const dy = moveEvent.clientY - presentationState.dragStart.y;
            elem.x = elemPos.x + dx;
            elem.y = elemPos.y + dy;
            renderSlide(presentationState.currentSlide);
        };
        
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            presentationState.isDragging = false;
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function updateTextFormat() {
        if(!presentationState.selectedElement) return;
        const elem = presentationState.selectedElement;
        
        elem.fontFamily = document.getElementById('fontFamily').value;
        elem.fontSize = parseInt(document.getElementById('fontSize').value);
        elem.textColor = document.getElementById('textColor').value;
        renderSlide(presentationState.currentSlide);
    }

    function toggleBold() {
        if(!presentationState.selectedElement) return;
        presentationState.selectedElement.isBold = !presentationState.selectedElement.isBold;
        renderSlide(presentationState.currentSlide);
    }

    function toggleItalic() {
        if(!presentationState.selectedElement) return;
        presentationState.selectedElement.isItalic = !presentationState.selectedElement.isItalic;
        renderSlide(presentationState.currentSlide);
    }

    function toggleUnderline() {
        if(!presentationState.selectedElement) return;
        presentationState.selectedElement.isUnderline = !presentationState.selectedElement.isUnderline;
        renderSlide(presentationState.currentSlide);
    }

    function changeSlideBg() {
        if(presentationState.currentSlide < 0) return;
        const bgColor = document.getElementById('slideBg').value;
        presentationState.slides[presentationState.currentSlide].bgColor = bgColor;
        renderSlide(presentationState.currentSlide);
    }

    function changeSlideLayout() {
        // Placeholder for layout changes
        alert('Layout templates coming soon!');
    }

    function nextSlide() {
        if(presentationState.currentSlide < presentationState.slides.length - 1) {
            presentationState.currentSlide++;
            updateSlidesList();
            renderSlide(presentationState.currentSlide);
            updateSlideCounter();
        }
    }

    function previousSlide() {
        if(presentationState.currentSlide > 0) {
            presentationState.currentSlide--;
            updateSlidesList();
            renderSlide(presentationState.currentSlide);
            updateSlideCounter();
        }
    }

    function updateSlideCounter() {
        const counter = document.getElementById('slideCounter');
        if(counter) {
            counter.textContent = (presentationState.currentSlide + 1) + ' / ' + presentationState.slides.length;
        }
    }

    function downloadPresentation() {
        if(presentationState.slides.length === 0) {
            alert('No slides to download');
            return;
        }
        
        const pptData = {
            title: 'My Presentation - ' + new Date().toISOString().slice(0,10),
            slides: presentationState.slides
        };
        
        const dataStr = JSON.stringify(pptData);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = pptData.title + '.pptx.json';
        link.click();
    }

    function uploadPresentation() {
        // Placeholder for file upload
        alert('File upload feature coming soon!');
    }

    function startSlideshow() {
        if(presentationState.slides.length === 0) {
            alert('No slides to present');
            return;
        }
        
        let currentSlideShow = 0;
        const overlay = document.createElement('div');
        overlay.className = 'slideshow-container';
        overlay.innerHTML = presentationState.slides.map((slide, index) => `
            <div class="slideshow-slide ${index === 0 ? 'active' : ''}" style="background: ${slide.bgColor};">
                <div style="padding: 40px; height: 100%; overflow: auto;">
                    ${slide.elements.map(elem => {
                        if(elem.type === 'text') {
                            return '<div style="position: absolute; left: ' + elem.x + 'px; top: ' + elem.y + 'px; width: ' + elem.width + 'px; font-size: ' + elem.fontSize + 'px; font-family: ' + elem.fontFamily + ';">' + elem.content + '</div>';
                        }
                        return '';
                    }).join('')}
                </div>
            </div>
        `).join('');
        
        overlay.innerHTML += `
            <div class="slideshow-controls">
                <button onclick="slideshowPrev(this)">← Previous</button>
                <button onclick="slideshowNext(this)">Next →</button>
                <button onclick="exitSlideshow()">Exit</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        window.slideshowPrev = function(btn) {
            currentSlideShow = Math.max(0, currentSlideShow - 1);
            updateSlideshowView(overlay, currentSlideShow);
        };
        
        window.slideshowNext = function(btn) {
            currentSlideShow = Math.min(presentationState.slides.length - 1, currentSlideShow + 1);
            updateSlideshowView(overlay, currentSlideShow);
        };
        
        window.exitSlideshow = function() {
            overlay.remove();
        };
    }

    function updateSlideshowView(overlay, slideIndex) {
        const slides = overlay.querySelectorAll('.slideshow-slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
    }

    function allowDrop(e) {
        e.preventDefault();
    }

    function dropElement(e) {
        e.preventDefault();
        alert('Drag and drop coming soon!');
    }

    function updateElementColor(color) {
        if(!presentationState.selectedElement) return;
        presentationState.selectedElement.textColor = color;
        renderSlide(presentationState.currentSlide);
    }

    // Initialize presentation when tool is opened
    if(toolName === 'presentations') {
        setTimeout(initPresentation, 100);
    }

