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
  const orgInput = document.getElementById("badgeOrg");
  const generateBtn = document.getElementById("generateBadge");
  const downloadBtn = document.getElementById("downloadBadge");
  const resetBtn = document.getElementById("resetBadge");
  const previewHint = document.getElementById("previewHint");

  let uploadedPhoto = null;
  let badgeGenerated = false;
  let selectedRole = "speaker";
  let selectedLayout = "portrait";

  // Layout configurations
  const layoutConfig = {
    portrait: { width: 600, height: 900 },
    landscape: { width: 900, height: 600 },
    square: { width: 800, height: 800 }
  };

  // Preload frame images
  const frameImages = {
    background1: new Image(),
    background2: new Image(),
    footer: new Image(),
    logoSide: new Image()
  };

  frameImages.background1.src = "assets/images/badge-frames/background1.png";
  frameImages.background2.src = "assets/images/badge-frames/backgroun2.png";
  frameImages.footer.src = "assets/images/badge-frames/footer.png";
  frameImages.logoSide.src = "assets/images/badge-frames/logoside.png";

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
        const org = orgInput.value.trim();
        drawModernBadge(name, org, selectedRole);
      } else {
        drawPlaceholder();
      }
    });
  });

  // Load uploaded photo with preview
  photoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          uploadedPhoto = img;
          photoPreviewImg.src = event.target.result;
          photoPreview.classList.remove("d-none");
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Generate badge
  generateBtn.addEventListener("click", function () {
    const name = nameInput.value.trim();
    const org = orgInput.value.trim();

    if (!name) {
      alert("Please enter your name");
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
      drawModernBadge(name, org, selectedRole);
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
    orgInput.value = "";
    document.getElementById("roleSpeaker").checked = true;
    document.getElementById("layoutPortrait").checked = true;
    selectedRole = "speaker";
    selectedLayout = "portrait";
    canvas.width = 600;
    canvas.height = 900;
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
  function drawModernBadge(name, org, role) {
    const width = canvas.width;
    const height = canvas.height;
    const isLandscape = selectedLayout === "landscape";
    const isSquare = selectedLayout === "square";

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Choose background based on role
    const bgImage =
      role === "speaker" ? frameImages.background1 : frameImages.background2;

    // Draw background image
    if (bgImage.complete) {
      ctx.drawImage(bgImage, 0, 0, width, height);
    } else {
      // Fallback gradient if image not loaded
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Layout-specific positioning
    let photoSize, photoX, photoY, logoSize, logoX, logoY;
    let nameY, roleY, detailsY, footerHeight;

    if (isLandscape) {
      // Landscape layout - photo on left, info on right
      photoSize = 200;
      photoX = 220;
      photoY = height / 2;
      logoSize = 120;
      logoX = 30;
      logoY = 30;
      nameY = height / 2 - 40;
      roleY = height / 2 + 90;
      detailsY = height - 120;
      footerHeight = 100;
    } else if (isSquare) {
      // Square layout - centered and compact
      photoSize = 220;
      photoX = width / 2;
      photoY = 250;
      logoSize = 150;
      logoX = 30;
      logoY = 30;
      nameY = 460;
      roleY = 550;
      detailsY = 630;
      footerHeight = 120;
    } else {
      // Portrait layout - original design
      photoSize = 240;
      photoX = width / 2;
      photoY = 280;
      logoSize = 180;
      logoX = 30;
      logoY = 30;
      nameY = 480;
      roleY = org ? 600 : 570;
      detailsY = 720;
      footerHeight = 150;
    }

    // Logo side decoration
    if (frameImages.logoSide.complete) {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(frameImages.logoSide, logoX, logoY, logoSize, logoSize);
      ctx.globalAlpha = 1.0;
    }

    // Photo section with modern circular frame
    // Outer glow
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // White circle border with gradient
    const photoGradient = ctx.createLinearGradient(
      photoX - photoSize / 2,
      photoY - photoSize / 2,
      photoX + photoSize / 2,
      photoY + photoSize / 2
    );
    photoGradient.addColorStop(0, "#ffffff");
    photoGradient.addColorStop(1, "#f0f0f0");

    ctx.beginPath();
    ctx.arc(photoX, photoY, photoSize / 2 + 12, 0, Math.PI * 2);
    ctx.fillStyle = photoGradient;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Draw photo (circular crop)
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Calculate photo dimensions to fill circle
    const aspectRatio = uploadedPhoto.width / uploadedPhoto.height;
    let drawWidth, drawHeight;
    if (aspectRatio > 1) {
      drawHeight = photoSize;
      drawWidth = photoSize * aspectRatio;
    } else {
      drawWidth = photoSize;
      drawHeight = photoSize / aspectRatio;
    }

    const drawX = photoX - drawWidth / 2;
    const drawY = photoY - drawHeight / 2;
    ctx.drawImage(uploadedPhoto, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Name and org positioning
    let nameX = isLandscape ? 580 : width / 2;
    let orgX = nameX;

    // Name text with shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = "#ffffff";
    const nameFontSize = isLandscape ? 44 : isSquare ? 48 : 56;
    ctx.font = `bold ${nameFontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = isLandscape ? "left" : "center";
    ctx.fillText(name.toUpperCase(), nameX, nameY);

    // Organization with subtle styling
    if (org) {
      const orgFontSize = isLandscape ? 26 : isSquare ? 28 : 32;
      ctx.font = `${orgFontSize}px "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      const orgYOffset = isLandscape ? 35 : isSquare ? 40 : 50;
      ctx.fillText(org, orgX, nameY + orgYOffset);
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Role badge - modern pill design
    const roleColors = {
      speaker: { bg: "#FFD700", text: "#000000", icon: "🎤" },
      attendee: { bg: "#00D4FF", text: "#000000", icon: "👥" },
      volunteer: { bg: "#FF6B6B", text: "#FFFFFF", icon: "🤝" }
    };

    const roleText = {
      speaker: "SPEAKER",
      attendee: "ATTENDEE",
      volunteer: "VOLUNTEER"
    };

    const roleConfig = roleColors[role];
    const roleWidth = isLandscape ? 200 : isSquare ? 220 : 240;
    const roleHeight = isLandscape ? 50 : isSquare ? 55 : 60;
    const roleX = isLandscape ? 580 : width / 2 - roleWidth / 2;

    // Role pill background with shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = roleConfig.bg;
    roundRect(ctx, roleX, roleY - 40, roleWidth, roleHeight, 30);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Role text
    ctx.fillStyle = roleConfig.text;
    const roleFontSize = isLandscape ? 26 : isSquare ? 28 : 32;
    ctx.font = `bold ${roleFontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = isLandscape ? "left" : "center";
    const roleTextX = isLandscape ? roleX + roleWidth / 2 - 50 : width / 2;
    ctx.fillText(roleText[role], roleTextX, roleY);

    // Event details section
    ctx.textAlign = isLandscape ? "left" : "center";
    const detailsX = isLandscape ? 580 : width / 2;

    // Event title
    ctx.fillStyle = "#ffffff";
    const eventTitleSize = isLandscape ? 22 : isSquare ? 24 : 28;
    ctx.font = `bold ${eventTitleSize}px "Segoe UI", Arial, sans-serif`;
    ctx.fillText("BEST PRACTICES SUMMIT", detailsX, detailsY);

    // Date and location
    const eventDateSize = isLandscape ? 18 : isSquare ? 20 : 24;
    ctx.font = `${eventDateSize}px "Segoe UI", Arial, sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillText(
      "24 JANUARY 2025 • GANDHINAGAR",
      detailsX,
      detailsY + (isLandscape ? 30 : isSquare ? 35 : 40)
    );

    // Footer image or fallback
    if (frameImages.footer.complete && !isLandscape) {
      ctx.drawImage(
        frameImages.footer,
        0,
        height - footerHeight,
        width,
        footerHeight
      );
    } else {
      // Footer gradient
      const footerGradient = ctx.createLinearGradient(
        0,
        height - footerHeight,
        0,
        height
      );
      footerGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
      footerGradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");
      ctx.fillStyle = footerGradient;
      ctx.fillRect(0, height - footerHeight, width, footerHeight);

      // Website and social
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      const footerFontSize = isLandscape ? 18 : isSquare ? 20 : 22;
      ctx.font = `bold ${footerFontSize}px "Segoe UI", Arial, sans-serif`;
      ctx.fillText(
        "thehackersmeetup.org",
        width / 2,
        height - footerHeight / 2 - 10
      );
      ctx.font = `${footerFontSize - 4}px "Segoe UI", Arial, sans-serif`;
      ctx.fillText(
        "@thehackersmeetup",
        width / 2,
        height - footerHeight / 2 + 20
      );
    }
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
      height / 2 + 80
    );
  }

  // Initialize with placeholder
  drawPlaceholder();
});
