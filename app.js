(() => {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;

  const siteSelect = document.getElementById("site");
  const customBlock = document.getElementById("customBlock");
  const customText = document.getElementById("customText");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const filelist = document.getElementById("filelist");
  const stampBtn = document.getElementById("stampBtn");
  const statusNote = document.getElementById("statusNote");

  let files = [];

  for (const site of SITES) {
    const opt = document.createElement("option");
    opt.value = site.id;
    opt.textContent = site.label;
    siteSelect.appendChild(opt);
  }

  function currentSite() {
    return SITES.find((s) => s.id === siteSelect.value);
  }

  function updateCustomVisibility() {
    customBlock.style.display = currentSite()?.custom ? "block" : "none";
  }
  siteSelect.addEventListener("change", updateCustomVisibility);
  updateCustomVisibility();

  function renderFileList() {
    filelist.innerHTML = "";
    for (const f of files) {
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = f.name;
      const status = document.createElement("span");
      status.className = "status";
      status.textContent = "ready";
      li.appendChild(name);
      li.appendChild(status);
      li.dataset.name = f.name;
      filelist.appendChild(li);
    }
    stampBtn.disabled = files.length === 0;
  }

  function setStatus(name, text, cls) {
    const li = filelist.querySelector(`li[data-name="${CSS.escape(name)}"]`);
    if (!li) return;
    const status = li.querySelector(".status");
    status.textContent = text;
    status.className = "status" + (cls ? " " + cls : "");
  }

  function addFiles(list) {
    for (const f of list) {
      if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) continue;
      if (!files.some((existing) => existing.name === f.name && existing.size === f.size)) {
        files.push(f);
      }
    }
    renderFileList();
  }

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => addFiles(e.target.files));

  ["dragenter", "dragover"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("drag");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("drag");
    })
  );
  dropzone.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  function stampLines(site) {
    if (site.custom) {
      return customText.value.split("\n").filter((l) => l.trim().length > 0);
    }
    return site.lines;
  }

  async function stampPdf(bytes, site) {
    const opts = Object.assign({}, DEFAULT_STAMP, site.stamp || {});
    const lines = stampLines(site);
    if (lines.length === 0) throw new Error("No stamp text configured");

    const doc = await PDFDocument.load(bytes);
    const font = await doc.embedFont(StandardFonts[opts.font] || StandardFonts.TimesRoman);
    const color = rgb(opts.color.r, opts.color.g, opts.color.b);

    const pages = opts.applyToAllPages ? doc.getPages() : [doc.getPages()[0]];
    for (const page of pages) {
      let y = opts.firstLineY;
      for (const line of lines) {
        page.drawText(line, { x: opts.x, y, size: opts.fontSize, font, color });
        y -= opts.lineHeight;
      }
    }
    return doc.save();
  }

  function outName(originalName) {
    const base = originalName.replace(/\.pdf$/i, "");
    return `${base}-stamped.pdf`;
  }

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  stampBtn.addEventListener("click", async () => {
    const site = currentSite();
    if (!site) return;
    if (site.custom && stampLines(site).length === 0) {
      statusNote.textContent = "Type in the custom block first.";
      statusNote.style.color = "var(--err)";
      return;
    }

    stampBtn.disabled = true;
    statusNote.textContent = "";
    const results = [];

    for (const file of files) {
      setStatus(file.name, "stamping…");
      try {
        const bytes = await file.arrayBuffer();
        const stamped = await stampPdf(bytes, site);
        results.push({ name: outName(file.name), bytes: stamped });
        setStatus(file.name, "done", "ok");
      } catch (err) {
        console.error(err);
        setStatus(file.name, "failed", "err");
      }
    }

    if (results.length === 1) {
      download(new Blob([results[0].bytes], { type: "application/pdf" }), results[0].name);
    } else if (results.length > 1) {
      const zip = new JSZip();
      for (const r of results) zip.file(r.name, r.bytes);
      const zipBytes = await zip.generateAsync({ type: "blob" });
      download(zipBytes, "stamped-invoices.zip");
    }

    statusNote.textContent = `${results.length} of ${files.length} file(s) stamped.`;
    statusNote.style.color = results.length === files.length ? "var(--ok)" : "var(--err)";
    stampBtn.disabled = files.length === 0;
  });
})();
