/**
 * Badge Generator for Best Practices Summit
 * Modern design with custom frame images
 */

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("badgeCanvas");
  const ctx = canvas.getContext("2d");
  const photoInput = document.getElementById("badgePhoto");
  const photoPreview = document.getElementById("photoPreview");
  const photoPreviewImg = document.getElementById("photoPreviewImg");
  const nameInput = document.getElementById("badgeName");
  const generateBtn = document.getElementById("generateBadge");
  const downloadBtn = document.getElementById("downloadBadge");
  const resetBtn = document.getElementById("resetBadge");
  const previewHint = document.getElementById("previewHint");

  let uploadedPhoto = null;
  let badgeGenerated = false;
  let selectedRole = "speaker";
  let selectedLayout = "portrait";
  let fontsLoaded = false;
  let cropper = null;
  const imageToCrop = document.getElementById("imageToCrop");
  const cropModal = new bootstrap.Modal(document.getElementById("cropModal"));
  const cropButton = document.getElementById("cropButton");
  const changePhotoBtn = document.getElementById("changePhotoBtn");

  // Preload Prompt font for canvas
  document.fonts.ready.then(function () {
    fontsLoaded = true;
    console.log("Prompt font loaded successfully");
  });

  // Layout configurations - exact Figma dimensions
  const layoutConfig = {
    portrait: { width: 564, height: 1000 },
    landscape: { width: 1192, height: 700 },
    square: { width: 564, height: 700 },
  };

  // Preload frame images
  const frameImages = {
    // Background images for different layouts
    backgroundPortrait: new Image(),
    backgroundLandscape: new Image(),
    backgroundSquare: new Image(),
    // Footer images for different layouts
    footerPortrait: new Image(),
    footerLandscape: new Image(),
    footerSquare: new Image(),
    // Photo frame images for different layouts
    framePortrait: new Image(),
    frameLandscape: new Image(),
    frameSquare: new Image(),
    // Logo images
    bpsLogo: new Image(),
    thmLogo: new Image(),
  };

  // Load background images
  frameImages.backgroundPortrait.src =
    "assets/images/badge-frames/background-potrait.svg";
  frameImages.backgroundLandscape.src =
    "assets/images/badge-frames/background-landscape.svg";
  frameImages.backgroundSquare.src =
    "assets/images/badge-frames/background-square.svg";

  // Load footer images
  frameImages.footerPortrait.src =
    "assets/images/badge-frames/footer-badge-potrait.svg";
  frameImages.footerLandscape.src =
    "assets/images/badge-frames/footer-badge-landscape.svg";
  frameImages.footerSquare.src =
    "assets/images/badge-frames/footer-badge-square.svg";

  // Load photo frame images
  frameImages.framePortrait.src =
    "assets/images/badge-frames/frame-potrait.svg";
  frameImages.frameLandscape.src =
    "assets/images/badge-frames/frame-landscape.svg";
  frameImages.frameSquare.src = "assets/images/badge-frames/frame-square.svg";

  // Load logo images
  frameImages.bpsLogo.src = "assets/images/BPS/logo.png";
  frameImages.gtuVenturesLogo = new Image();
  frameImages.gtuVenturesLogo.src = "assets/NewImages/gtuVentures.png";

  // Get selected role
  document.querySelectorAll('input[name="badgeRole"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      selectedRole = this.value;
    });
  });

  // Get selected layout
  document.querySelectorAll('input[name="badgeLayout"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      selectedLayout = this.value;
      const config = layoutConfig[selectedLayout];
      canvas.width = config.width;
      canvas.height = config.height;
      if (badgeGenerated) {
        const name = nameInput.value.trim();
        drawModernBadge(name, selectedRole);
      } else {
        drawPlaceholder();
      }
    });
  });

  // Load uploaded photo with Cropper.js
  photoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // Destroy old cropper if exists
        if (cropper) {
          cropper.destroy();
          cropper = null;
        }

        imageToCrop.src = event.target.result;
        cropModal.show();

        // Initialize cropper after modal is shown to ensure correct dimensions
        const cropModalEl = document.getElementById("cropModal");

        // Define the handler function so we can remove it to avoid duplicates
        const onModalShown = function () {
          if (cropper) {
            cropper.destroy();
          }
          cropper = new Cropper(imageToCrop, {
            aspectRatio: 1, // Enforce 1:1 square aspect ratio for badges
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            background: true,
            minContainerWidth: 200,
            minContainerHeight: 200,
          });
          cropModalEl.removeEventListener('shown.bs.modal', onModalShown);
        };

        cropModalEl.addEventListener('shown.bs.modal', onModalShown);

        // Reset file input so the same file can be uploaded again if needed
        photoInput.value = '';
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle Modal Hidden Event to cleanup if user cancels
  document.getElementById("cropModal").addEventListener('hidden.bs.modal', function () {
    if (cropper && !uploadedPhoto) {
      // If user hit cancel, and hasn't uploaded a photo before, clean up
      photoInput.value = '';
    }
  });

  // Handle Crop Button Click
  cropButton.addEventListener("click", function () {
    if (!cropper) return;

    // Get cropped canvas
    const croppedCanvas = cropper.getCroppedCanvas({
      width: 400,
      height: 400,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    // Set to preview and store for canvas drawing
    const croppedImageURL = croppedCanvas.toDataURL("image/png");
    photoPreviewImg.src = croppedImageURL;

    const img = new Image();
    img.onload = function () {
      uploadedPhoto = img;
      photoPreview.classList.remove("d-none");
      cropModal.hide();

      // Update badge if already generated
      if (badgeGenerated) {
        const name = nameInput.value.trim();
        drawModernBadge(name, selectedRole);
      }
    };
    img.src = croppedImageURL;
  });

  // Handle changing photo
  if (changePhotoBtn) {
    changePhotoBtn.addEventListener("click", function () {
      photoInput.click();
    });
  }

  // Generate badge
  generateBtn.addEventListener("click", function () {
    const name = nameInput.value.trim();

    if (!name) {
      alert("Please enter your name");
      nameInput.focus();
      return;
    }

    // Check if name exceeds 18 characters
    if (name.length > 18) {
      alert(
        "Name must be 18 characters or less. Current length: " + name.length,
      );
      nameInput.focus();
      return;
    }

    if (!uploadedPhoto) {
      alert("Please upload a photo");
      photoInput.click();
      return;
    }

    // Add loading animation
    generateBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
    generateBtn.disabled = true;

    // Generate badge with slight delay for smooth UX
    setTimeout(() => {
      drawModernBadge(name, selectedRole);
      badgeGenerated = true;
      downloadBtn.disabled = false;
      previewHint.innerHTML =
        '<i class="fas fa-check-circle me-2 text-success"></i><span class="text-success fw-bold">Badge generated! Click download to save.</span>';
      generateBtn.innerHTML =
        '<i class="fas fa-magic me-2"></i>Generate My Badge';
      generateBtn.disabled = false;
    }, 500);
  });

  // Download badge
  downloadBtn.addEventListener("click", function () {
    if (!badgeGenerated) return;

    const link = document.createElement("a");
    const name = nameInput.value.trim().replace(/\s+/g, "_");
    const role = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
    link.download = `BPS_2025_${role}_Badge_${name}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();

    // Success feedback
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-check me-2"></i>Downloaded!';
    setTimeout(() => {
      downloadBtn.innerHTML = originalText;
    }, 2000);
  });

  // Reset badge
  resetBtn.addEventListener("click", function () {
    nameInput.value = "";
    document.getElementById("roleSpeaker").checked = true;
    document.getElementById("layoutPortrait").checked = true;
    selectedRole = "speaker";
    selectedLayout = "portrait";
    canvas.width = 564;
    canvas.height = 1000;
    photoInput.value = "";
    uploadedPhoto = null;
    badgeGenerated = false;
    downloadBtn.disabled = true;
    photoPreview.classList.add("d-none");
    previewHint.innerHTML =
      '<i class="fas fa-info-circle me-2"></i>Fill in your details and click "Generate My Badge"';

    // Clear canvas with placeholder
    drawPlaceholder();
  });

  // Draw modern badge design
  function drawModernBadge(name, role) {
    const width = canvas.width;
    const height = canvas.height;
    const isLandscape = selectedLayout === "landscape";
    const isSquare = selectedLayout === "square";

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw premium gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#4a00e0"); // Deep purple
    bgGradient.addColorStop(1, "#8e2de2"); // Vibrant purple/pink
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle background pattern/shapes for a premium look
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, width * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.8, width * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Layout-specific positioning
    let photoSize, photoX, photoY;
    let nameY, roleY, detailsY, footerHeight;

    if (isLandscape) {
      photoSize = 350;
      photoX = width - 250;
      photoY = height / 2 - 20;
      nameY = height / 2 - 30;
      roleY = height / 2 + 30;
      detailsY = height / 2 + 100;
      footerHeight = 80;
    } else if (isSquare) {
      photoSize = 280;
      photoX = width / 2;
      photoY = height / 2 - 80;
      nameY = height / 2 + 100;
      roleY = height / 2 + 150;
      detailsY = height / 2 + 200;
      footerHeight = 60;
    } else { // Portrait
      photoSize = 380;
      photoX = width / 2;
      photoY = 380;
      nameY = 660;
      roleY = 730;
      detailsY = 820;
      footerHeight = 80;
    }

    // Logo positioning configuration
    let bpsLogoWidth = isLandscape ? 300 : isSquare ? 200 : 250;
    let bpsLogoHeight = bpsLogoWidth * 0.3; // Approximate aspect ratio
    let bpsLogoX = isLandscape ? 80 : (width - bpsLogoWidth) / 2;
    let bpsLogoY = isLandscape ? 60 : 40;

    let gtuLogoWidth = isLandscape ? 200 : isSquare ? 150 : 180;
    let gtuLogoHeight = gtuLogoWidth * 0.3;
    let gtuLogoX = isLandscape ? (width - gtuLogoWidth - 80) : (width - gtuLogoWidth) / 2;
    let gtuLogoY = isLandscape ? 60 : (bpsLogoY + bpsLogoHeight + (isSquare ? 10 : 20));

    // Draw logos on top
    if (frameImages.bpsLogo.complete) {
      ctx.drawImage(frameImages.bpsLogo, bpsLogoX, bpsLogoY, bpsLogoWidth, bpsLogoHeight);
    }

    // Draw GTU Ventures logo (with a white background pill for visibility against purple)
    if (frameImages.gtuVenturesLogo && frameImages.gtuVenturesLogo.complete) {
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      const paddingX = 15;
      const paddingY = 8;
      roundRect(ctx, gtuLogoX - paddingX, gtuLogoY - paddingY, gtuLogoWidth + paddingX * 2, gtuLogoHeight + paddingY * 2, 8);
      ctx.fill();
      ctx.restore();
      ctx.drawImage(frameImages.gtuVenturesLogo, gtuLogoX, gtuLogoY, gtuLogoWidth, gtuLogoHeight);
    }

    // Draw photo with a sleek circular frame
    if (uploadedPhoto) {
      ctx.save();

      // Outer glow/shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 10;

      // White border
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoSize / 2 + 8, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Secondary colorful border
      ctx.shadowColor = "transparent";
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoSize / 2 + 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd700"; // Gold accent
      ctx.fill();

      // Clipping path for the actual image
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoSize / 2, 0, Math.PI * 2);
      ctx.clip();

      // Draw image centered and scaled to cover
      const targetWidth = photoSize;
      const targetHeight = photoSize;
      const aspectRatio = uploadedPhoto.width / uploadedPhoto.height;
      const targetAspectRatio = 1; // It's a circle/square

      let drawWidth, drawHeight;
      if (aspectRatio > targetAspectRatio) {
        drawHeight = targetHeight;
        drawWidth = targetHeight * aspectRatio;
      } else {
        drawWidth = targetWidth;
        drawHeight = targetWidth / aspectRatio;
      }

      const drawX = photoX - drawWidth / 2;
      const drawY = photoY - drawHeight / 2;
      ctx.drawImage(uploadedPhoto, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    }

    // Name text
    let nameX = isLandscape ? 80 : width / 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = "#ffffff";
    const nameFontSize = isLandscape ? 56 : isSquare ? 42 : 54;
    ctx.font = `bold ${nameFontSize}px "Montserrat", "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = isLandscape ? "left" : "center";
    ctx.fillText(name.toUpperCase(), nameX, nameY);
    ctx.shadowColor = "transparent";

    // Role text (Premium pill design)
    const roleStatusText = {
      speaker: "SPEAKER",
      attendee: "ATTENDEE",
      volunteer: "VOLUNTEER"
    };

    const roleText = roleStatusText[role];
    const roleFontSize = isLandscape ? 28 : 24;
    ctx.font = `bold ${roleFontSize}px "Montserrat", "Segoe UI", Arial, sans-serif`;

    const roleTextMetrics = ctx.measureText(roleText);
    const roleTextWidth = roleTextMetrics.width;
    const paddingX = 24;
    const paddingY = 12;

    let rolePillX = isLandscape ? nameX : (width / 2 - roleTextWidth / 2 - paddingX);
    let rolePillY = roleY - roleFontSize;

    // Draw role pill background
    ctx.save();
    ctx.fillStyle = role === "speaker" ? "#ffd700" : role === "volunteer" ? "#00d2ff" : "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    roundRect(ctx, rolePillX, rolePillY, roleTextWidth + paddingX * 2, roleFontSize + paddingY * 2, Math.min(roleFontSize, 20));
    ctx.fill();
    ctx.restore();

    // Draw role text
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.fillText(roleText, rolePillX + paddingX + roleTextWidth / 2, rolePillY + roleFontSize + paddingY / 2 - 2);

    // Event title / details
    const detailsX = isLandscape ? 80 : width / 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    const eventTitleSize = isLandscape ? 32 : isSquare ? 24 : 32;
    ctx.font = `bold ${eventTitleSize}px "Montserrat", "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = isLandscape ? "left" : "center";
    ctx.fillText("BEST PRACTICES SUMMIT 2026", detailsX, detailsY);

    // Modern solid footer
    const footerGradient = ctx.createLinearGradient(0, height - footerHeight, 0, height);
    footerGradient.addColorStop(0, "rgba(0, 0, 0, 0.4)");
    footerGradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");
    ctx.fillStyle = footerGradient;
    ctx.fillRect(0, height - footerHeight, width, footerHeight);

    // Footer text
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    const footerFontSize = isSquare ? 16 : 22;
    ctx.font = `500 ${footerFontSize}px "Roboto", "Segoe UI", Arial, sans-serif`;
    ctx.fillText("www.bps-summit.com", width / 2, height - footerHeight / 2 + (footerFontSize / 3));
  }

  // Helper function for rounded rectangles
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Draw placeholder
  function drawPlaceholder() {
    const width = canvas.width;
    const height = canvas.height;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8f9fa");
    gradient.addColorStop(1, "#e9ecef");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Icon
    ctx.font = '80px "Font Awesome 6 Free"';
    ctx.fillStyle = "#dee2e6";
    ctx.textAlign = "center";
    ctx.fillText("🎫", width / 2, height / 2 - 40);

    // Text
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = "#adb5bd";
    ctx.fillText("Your badge will appear here", width / 2, height / 2 + 40);

    ctx.font = '20px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = "#ced4da";
    ctx.fillText(
      "Upload your photo and click Generate",
      width / 2,
      height / 2 + 80,
    );
  }

  // Initialize with placeholder
  drawPlaceholder();
});
