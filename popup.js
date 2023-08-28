document
  .getElementById("openTableButton")
  .addEventListener("click", async () => {
    try {
      // Fetch data from the API
      const response = await fetch(
        "https://app.blinkcrm.in/api/whatsapp?api_key=19a5c89fb2ef43c1969d00e4554ab99e"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Open a new window
      const tableWindow = window.open("", "_blank", "width=600,height=400");

      // Create a table element and add content
      const table = document.createElement("table");
      const headerRow = table.insertRow();
      const headerCell1 = headerRow.insertCell(0);
      const headerCell2 = headerRow.insertCell(1);
      headerCell1.textContent = "Name";
      headerCell2.textContent = "Phone";

      for (const entry of data.leads) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = entry.name;
        cell2.innerHTML = `<a href="javascript:void(0);" class="whatsapp-link" data-phone="${
          entry.phone
        }" data-message="${encodeURIComponent(data.message)}">${
          entry.phone
        }</a>`;
      }

      // Append the table to the new window's document
      tableWindow.document.body.appendChild(table);

      // Attach event listeners to WhatsApp links
      const whatsappLinks =
        tableWindow.document.querySelectorAll(".whatsapp-link");
      whatsappLinks.forEach((link) => {
        link.addEventListener("click", onWhatsAppLinkClick);
      });
    } catch (error) {
      console.error("Error fetching or displaying data:", error);
    }
  });
function onWhatsAppLinkClick(event) {
  event.preventDefault();
  const phone = event.target.getAttribute("data-phone");
  const message = decodeURIComponent(event.target.getAttribute("data-message"));
  const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`;

  // Open a new window with the WhatsApp Web URL
  chrome.windows.create({ url: url, type: "popup", width: 600, height: 400 });
}
