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
  frameImages.bpsLogo.src = "assets/images/badge-frames/bps-logo-badge.svg";
  frameImages.thmLogo.src =
    "assets/images/badge-frames/logo-full-white-thm.svg";

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

    // Choose background image based on layout
    let bgImage;
    if (selectedLayout === "landscape") {
      bgImage = frameImages.backgroundLandscape;
    } else if (selectedLayout === "square") {
      bgImage = frameImages.backgroundSquare;
    } else {
      bgImage = frameImages.backgroundPortrait;
    }

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

    // Layout-specific positioning - adjusted for exact frame dimensions
    let photoSize, photoX, photoY;
    let nameY, roleY, detailsY, footerHeight;

    if (isLandscape) {
      // Landscape layout - 1192x700 - Frame 31551 design - FIXED
      photoSize = 500; // Larger frame for right side
      photoX = width - 320; // Position properly on right side
      photoY = height / 2; // Center vertically
      nameY = 360; // Lowered for better vertical profile
      roleY = 420; // Lowered
      detailsY = 490; // Lowered
      footerHeight = 67; // Official height
    } else if (isSquare) {
      // Square layout - 564x700 - UPDATED: larger centered frame with top margin
      photoSize = 350; // Much larger frame to match reference
      photoX = width / 2; // Keep centered horizontally
      photoY = 280; // Add top margin, position lower to center better
      nameY = 520; // Moved down closer to footer
      roleY = 560; // This will be "I'm attending" text
      detailsY = 600; // This will be "BEST PRACTICES SUMMIT" - closer to footer
      footerHeight = 50; // Much smaller footer
    } else {
      // Portrait layout - 564x1000 - Frame 31552 design - FIXED to match reference
      photoSize = 442; // Much larger frame to match reference
      photoX = width / 2; // Centered horizontally
      photoY = 290; // Moved up by 20px to reduce top spacing
      nameY = 750; // Adjusted to be below the frame
      roleY = 810; // Role text below name
      detailsY = 870; // Event details
      footerHeight = 67; // Exact height as specified
    }

    // Logo positioning - will be drawn AFTER the photo frame to appear on top
    let bpsLogoWidth, bpsLogoHeight, bpsLogoX, bpsLogoY;
    if (isLandscape) {
      bpsLogoWidth = 303;
      bpsLogoHeight = 75;
      bpsLogoX = 110; // Increased padding to 110px
      bpsLogoY = 60; // Top positioning
    } else if (isSquare) {
      bpsLogoWidth = 233; // Keep square unchanged
      bpsLogoHeight = 57;
      bpsLogoX = 40; // More padding from edge
      bpsLogoY = 40;
    } else {
      // Portrait - positioned at top like reference
      bpsLogoWidth = 233;
      bpsLogoHeight = 57;
      bpsLogoX = 60; // Left side with proper margin
      bpsLogoY = 540; // Moved up by 20px to reduce top spacing
    }

    // THM Logo positioning
    let thmLogoWidth, thmLogoHeight, thmLogoX, thmLogoY;
    if (isLandscape) {
      thmLogoWidth = 120;
      thmLogoHeight = 87;
      thmLogoX = width - thmLogoWidth - 620; // Right side positioning
      thmLogoY = 60; // Top positioning
    } else if (isSquare) {
      thmLogoWidth = 102; // Keep square unchanged
      thmLogoHeight = 74;
      thmLogoX = width - thmLogoWidth - 40; // More padding from edge
      thmLogoY = 40;
    } else {
      // Portrait - positioned at top like reference
      thmLogoWidth = 120;
      thmLogoHeight = 87;
      thmLogoX = width - thmLogoWidth - 60; // Right side with proper margin
      thmLogoY = 530; // Moved up by 20px to reduce top spacing
    }

    // Photo section with frame - photo fits perfectly within frame curves
    // Choose frame image based on layout
    let frameImage;
    if (selectedLayout === "landscape") {
      frameImage = frameImages.frameLandscape;
    } else if (selectedLayout === "square") {
      frameImage = frameImages.frameSquare;
    } else {
      frameImage = frameImages.framePortrait;
    }

    // Draw photo first (behind the frame) - fit within frame curves
    if (uploadedPhoto) {
      // Get actual frame dimensions
      let frameWidth, frameHeight, cornerRadius;
      if (selectedLayout === "square") {
        frameWidth = 278;
        frameHeight = 305;
        cornerRadius = 20; // Estimated corner radius for square frame
      } else if (selectedLayout === "portrait") {
        frameWidth = 450;
        frameHeight = 416;
        cornerRadius = 25; // Estimated corner radius for portrait frame
      } else {
        // Landscape - Updated to 485x572
        frameWidth = 485;
        frameHeight = 572;
        cornerRadius = 30;
      }

      // The frame SVG has a stroke border - we need to clip inside it
      // Border offset accounts for the stroke width of the frame path
      const borderOffset = 7; // Balanced offset for landscape to prevent downside spillover

      // Clipping dimensions - smaller to stay inside the frame border
      const clipWidth = frameWidth - borderOffset * 2;
      const clipHeight = frameHeight - borderOffset * 2;
      const clipCornerRadius = Math.max(0, cornerRadius - borderOffset);

      // Photo dimensions - fill the clipping area completely
      const targetWidth = clipWidth;
      const targetHeight = clipHeight;

      const aspectRatio = uploadedPhoto.width / uploadedPhoto.height;
      const targetAspectRatio = targetWidth / targetHeight;

      let drawWidth, drawHeight;

      if (aspectRatio > targetAspectRatio) {
        // Photo is wider than target - fit to target height, crop width
        drawHeight = targetHeight;
        drawWidth = targetHeight * aspectRatio;
      } else {
        // Photo is taller than target - fit to target width, crop height
        drawWidth = targetWidth;
        drawHeight = targetWidth / aspectRatio;
      }

      const drawX = photoX - drawWidth / 2;
      const drawY = photoY - drawHeight / 2;

      // Add subtle shadow behind photo
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;

      // Create rounded rectangle clipping path to match frame curves
      ctx.save();
      ctx.beginPath();

      // Create rounded rectangle path for clipping - use clip dimensions to stay inside border
      const clipX = photoX - clipWidth / 2;
      const clipY = photoY - clipHeight / 2;

      ctx.moveTo(clipX + clipCornerRadius, clipY);
      ctx.lineTo(clipX + clipWidth - clipCornerRadius, clipY);
      ctx.quadraticCurveTo(
        clipX + clipWidth,
        clipY,
        clipX + clipWidth,
        clipY + clipCornerRadius,
      );
      ctx.lineTo(clipX + clipWidth, clipY + clipHeight - clipCornerRadius);
      ctx.quadraticCurveTo(
        clipX + clipWidth,
        clipY + clipHeight,
        clipX + clipWidth - clipCornerRadius,
        clipY + clipHeight,
      );
      ctx.lineTo(clipX + clipCornerRadius, clipY + clipHeight);
      ctx.quadraticCurveTo(
        clipX,
        clipY + clipHeight,
        clipX,
        clipY + clipHeight - clipCornerRadius,
      );
      ctx.lineTo(clipX, clipY + clipCornerRadius);
      ctx.quadraticCurveTo(clipX, clipY, clipX + clipCornerRadius, clipY);
      ctx.closePath();

      ctx.clip();

      ctx.drawImage(uploadedPhoto, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    // Draw frame over the photo
    if (frameImage && frameImage.complete) {
      // Use actual frame dimensions
      if (selectedLayout === "square") {
        ctx.drawImage(frameImage, photoX - 278 / 2, photoY - 306 / 2, 278, 306);
      } else if (selectedLayout === "portrait") {
        ctx.drawImage(frameImage, photoX - 450 / 2, photoY - 416 / 2, 450, 416);
      } else {
        // Landscape - Updated to 485x572
        ctx.drawImage(frameImage, photoX - 485 / 2, photoY - 572 / 2, 485, 572);
      }
    } else {
      // Fallback: rounded rectangular frame if frame image not loaded
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 8;
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;

      const frameW =
        selectedLayout === "square"
          ? 278
          : selectedLayout === "portrait"
            ? 450
            : 485;
      const frameH =
        selectedLayout === "square"
          ? 306
          : selectedLayout === "portrait"
            ? 416
            : 572;
      const radius =
        selectedLayout === "square"
          ? 20
          : selectedLayout === "portrait"
            ? 25
            : 30;

      // Draw rounded rectangle
      ctx.beginPath();
      const x = photoX - frameW / 2;
      const y = photoY - frameH / 2;

      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + frameW - radius, y);
      ctx.quadraticCurveTo(x + frameW, y, x + frameW, y + radius);
      ctx.lineTo(x + frameW, y + frameH - radius);
      ctx.quadraticCurveTo(
        x + frameW,
        y + frameH,
        x + frameW - radius,
        y + frameH,
      );
      ctx.lineTo(x + radius, y + frameH);
      ctx.quadraticCurveTo(x, y + frameH, x, y + frameH - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      ctx.stroke();

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    // Draw logos AFTER the photo frame so they appear on top
    if (frameImages.bpsLogo.complete) {
      ctx.drawImage(
        frameImages.bpsLogo,
        bpsLogoX,
        bpsLogoY,
        bpsLogoWidth,
        bpsLogoHeight,
      );
    }

    if (frameImages.thmLogo.complete) {
      ctx.drawImage(
        frameImages.thmLogo,
        thmLogoX,
        thmLogoY,
        thmLogoWidth,
        thmLogoHeight,
      );
    }

    // Name positioning - fixed for landscape and portrait
    let nameX = isLandscape ? 110 : width / 2; // 110px padding for landscape, centered for others

    // Name text with shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = "#ffffff";
    const nameFontSize = 42; // Consistent font sizes
    ctx.font = `bold ${nameFontSize}px "Prompt", "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = isLandscape ? "left" : "center";
    ctx.fillText(name.toUpperCase(), nameX, nameY);

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Role section - keep square as is, update landscape and portrait to use gradient text
    if (isSquare) {
      // For square layout: keep original design (UNCHANGED)
      const roleStatusText = {
        speaker: "I'm speaking",
        attendee: "I'm attending",
        volunteer: "I'm volunteering",
      };

      // Create linear gradient for the role status text
      const roleGradient = ctx.createLinearGradient(
        0,
        roleY - 20,
        0,
        roleY + 20,
      );
      roleGradient.addColorStop(0, "#7E67D2");
      roleGradient.addColorStop(1, "#FBE8F7");
      ctx.fillStyle = roleGradient;

      ctx.font = `bold 33px "Prompt", "Segoe UI", Arial, sans-serif`; // Use Prompt font
      ctx.textAlign = "center";
      ctx.fillText(roleStatusText[role], width / 2, roleY);
    } else {
      // For landscape and portrait: use gradient text like square
      const roleStatusText = {
        speaker: "I'm speaking",
        attendee: "I'm attending",
        volunteer: "I'm volunteering",
      };

      // Create linear gradient for the role status text
      const roleGradient = ctx.createLinearGradient(
        0,
        roleY - 20,
        0,
        roleY + 20,
      );
      roleGradient.addColorStop(0, "#7E67D2");
      roleGradient.addColorStop(1, "#FBE8F7");
      ctx.fillStyle = roleGradient;

      const roleFontSize = isLandscape ? 42 : 42; // 42px for both landscape and portrait
      ctx.font = `bold ${roleFontSize}px "Prompt", "Segoe UI", Arial, sans-serif`;
      ctx.textAlign = isLandscape ? "left" : "center";
      ctx.fillText(roleStatusText[role], nameX, roleY);
    }

    // Event details section - remove date/time from portrait and landscape
    ctx.textAlign = isLandscape ? "left" : isSquare ? "center" : "center"; // Keep square centered
    const detailsX = isLandscape ? 110 : isSquare ? width / 2 : width / 2; // 110px padding for landscape

    // Event title - keep square logic as is, remove date/time from others
    ctx.fillStyle = "#ffffff";
    if (isSquare) {
      // Square layout - keep original design (UNCHANGED)
      const eventTitleSize = 33;
      ctx.font = `bold ${eventTitleSize}px "Prompt", "Segoe UI", Arial, sans-serif`;
      ctx.fillText("BEST PRACTICES SUMMIT", detailsX, detailsY);
      // No date and location for square layout
    } else {
      // Portrait and landscape layouts - NO DATE/TIME
      const eventTitleSize = isLandscape ? 42 : 42; // 42px for both
      ctx.font = `bold ${eventTitleSize}px "Prompt", "Segoe UI", Arial, sans-serif`;

      // For portrait, constrain to 494px max width
      if (!isLandscape) {
        ctx.fillText("BEST PRACTICES SUMMIT", detailsX, detailsY, 494);
      } else {
        ctx.fillText("BEST PRACTICES SUMMIT", detailsX, detailsY, 494);
      }
      // REMOVED: Date and location for portrait and landscape
    }

    // Footer image based on layout - these images already contain the social media icons
    // and website information in the correct professional layout
    let footerImage;
    if (selectedLayout === "landscape") {
      footerImage = frameImages.footerLandscape;
    } else if (selectedLayout === "square") {
      footerImage = frameImages.footerSquare;
    } else {
      footerImage = frameImages.footerPortrait;
    }

    if (footerImage.complete) {
      console.log("Footer image completed");

      if (isSquare) {
        // Square layout - footer with padding like the fallback
        const footerY = height - footerHeight - 20;
        const footerX = 30; // Side padding
        const footerW = width - 60; // Width with padding (60px each side)

        // Draw footer image with padding
        ctx.drawImage(
          footerImage,
          footerX, // Start from padded position
          footerY,
          footerW, // Use padded width
          footerHeight,
        );
      } else if (isLandscape) {
        // Landscape layout - footer with side padding and bottom margin
        const bottomMargin = 75;
        const footerW = 529; // Fixed width
        const footerH = 86; // Fixed height
        const footerY = height - footerH - bottomMargin;
        const footerX = 70; // Side padding for landscape

        ctx.drawImage(footerImage, footerX, footerY, footerW, footerH);
      } else {
        // Portrait layout - footer with side padding and bottom margin
        const bottomMargin = 20; // Bottom margin for portrait
        const footerY = height - footerHeight - bottomMargin;
        const footerX = 30; // Side padding for portrait
        const footerW = width - 60; // Width with padding (30px each side)

        ctx.drawImage(footerImage, footerX, footerY, footerW, footerHeight);
      }
    } else {
      console.log("in else");
      // Minimal footer fallback - just a subtle bar
      if (isSquare) {
        // Square layout - compact footer with proper styling like reference
        const footerY = height - footerHeight - 20; // Position closer to text
        const footerX = 60; // Much more side padding like reference
        const footerW = width - 120; // Width with proper padding (60px each side)
        const footerH = 40; // Much smaller height

        // Rounded rectangle background - subtle gradient like reference
        const footerGradient = ctx.createLinearGradient(
          footerX,
          footerY,
          footerX,
          footerY + footerH,
        );
        footerGradient.addColorStop(0, "rgba(255, 255, 255, 0.12)");
        footerGradient.addColorStop(1, "rgba(255, 255, 255, 0.08)");
        ctx.fillStyle = footerGradient;

        // Draw rounded rectangle
        roundRect(ctx, footerX, footerY, footerW, footerH, 20);
        ctx.fill();

        // Add subtle border like reference
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Website text - smaller and centered, matching reference
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = `14px "Segoe UI", Arial, sans-serif`;
        ctx.fillText("@thehackersmeetup", width / 2, footerY + footerH / 2 + 5);
      } else {
        // Other layouts - original footer
        const footerGradient = ctx.createLinearGradient(
          0,
          height - footerHeight,
          0,
          height,
        );
        footerGradient.addColorStop(0, "rgba(0, 0, 0, 0.2)");
        footerGradient.addColorStop(1, "rgba(0, 0, 0, 0.4)");
        ctx.fillStyle = footerGradient;
        ctx.fillRect(0, height - footerHeight, width, footerHeight);

        // Simple website text
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        const footerFontSize = isLandscape ? 16 : 20;
        ctx.font = `${footerFontSize}px "Segoe UI", Arial, sans-serif`;
        ctx.fillText(
          "thehackersmeetup.org",
          width / 2,
          height - footerHeight / 2 + 5,
        );
      }
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
      height / 2 + 80,
    );
  }

  // Initialize with placeholder
  drawPlaceholder();
});
