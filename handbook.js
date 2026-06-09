/* ── Comprehensive PDF handbook generator (uses jsPDF, loaded globally) ──
   Call window.generateHandbook({ items, suppliers, locations }) — all optional.
   Produces a multi-page user manual for the Store Inventory application.        */
(function () {
  const INK   = [26, 29, 41];
  const MUTE  = [99, 104, 130];
  const ACCENT= [79, 70, 229];
  const LINE  = [223, 226, 238];
  const SOFT  = [244, 245, 250];

  const M = 56;          // page margin
  const HANDBOOK_VERSION = '1.0';

  function build(data) {
    data = data || {};
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const CW = PW - M * 2;

    let y = M;
    let page = 1;

    /* ── low-level helpers ── */
    function footer() {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...MUTE);
      doc.text('Store Inventory — User Handbook', M, PH - 28);
      doc.text(String(page), PW - M, PH - 28, { align: 'right' });
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.6);
      doc.line(M, PH - 40, PW - M, PH - 40);
    }
    function newPage() {
      footer();
      doc.addPage();
      page++;
      y = M;
    }
    function need(h) {
      if (y + h > PH - 56) newPage();
    }
    function gap(h) { y += h; }

    function h1(text) {
      need(54);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(19);
      doc.setTextColor(...INK);
      doc.text(text, M, y);
      y += 10;
      doc.setDrawColor(...ACCENT);
      doc.setLineWidth(2);
      doc.line(M, y, M + 38, y);
      y += 20;
    }
    function h2(text) {
      need(34);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...ACCENT);
      doc.text(text, M, y);
      y += 17;
    }
    function para(text) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      const lines = doc.splitTextToSize(text, CW);
      lines.forEach(ln => {
        need(15);
        doc.text(ln, M, y);
        y += 15;
      });
      y += 4;
    }
    function bullet(text) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      const lines = doc.splitTextToSize(text, CW - 18);
      lines.forEach((ln, i) => {
        need(15);
        if (i === 0) {
          doc.setFillColor(...ACCENT);
          doc.circle(M + 3, y - 3.5, 1.8, 'F');
        }
        doc.text(ln, M + 16, y);
        y += 15;
      });
    }
    function step(n, text) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      const lines = doc.splitTextToSize(text, CW - 26);
      need(Math.max(20, lines.length * 15));
      doc.setFillColor(...ACCENT);
      doc.circle(M + 7, y - 3.5, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(String(n), M + 7, y - 0.5, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      lines.forEach((ln, i) => {
        if (i > 0) need(15);
        doc.text(ln, M + 24, y);
        y += 15;
      });
      y += 4;
    }
    function callout(title, text) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(text, CW - 28);
      const boxH = 22 + lines.length * 14;
      need(boxH + 6);
      doc.setFillColor(...SOFT);
      doc.setDrawColor(...LINE);
      doc.roundedRect(M, y - 10, CW, boxH, 6, 6, 'FD');
      doc.setFillColor(...ACCENT);
      doc.rect(M, y - 10, 3, boxH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...ACCENT);
      doc.text(title, M + 14, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...INK);
      let ty = y + 22;
      lines.forEach(ln => { doc.text(ln, M + 14, ty); ty += 14; });
      y += boxH + 12;
    }

    /* ── COVER ── */
    doc.setFillColor(...ACCENT);
    doc.rect(0, 0, PW, 200, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(255, 255, 255);
    doc.text('Store Inventory', M, 110);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Comprehensive User Handbook', M, 140);

    y = 250;
    doc.setTextColor(...INK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('About this handbook', M, y); y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    para('This handbook explains every feature of the Store Inventory application: how to track stock, set re-order thresholds, add incoming deliveries, record returned (unused) material, issue items to people and locations, read the statistics dashboard, and export your data. Keep it handy for onboarding new team members.');

    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    gap(6);
    doc.setFillColor(...SOFT);
    doc.setDrawColor(...LINE);
    doc.roundedRect(M, y, CW, 78, 8, 8, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...MUTE);
    doc.text('VERSION', M + 16, y + 24);
    doc.text('GENERATED', M + 16, y + 52);
    if (typeof data.itemCount === 'number') doc.text('ITEMS TRACKED', M + 220, y + 24);
    if (typeof data.locationCount === 'number') doc.text('LOCATIONS', M + 220, y + 52);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...INK);
    doc.text(HANDBOOK_VERSION, M + 130, y + 24);
    doc.text(today, M + 130, y + 52);
    if (typeof data.itemCount === 'number') doc.text(String(data.itemCount), M + 340, y + 24);
    if (typeof data.locationCount === 'number') doc.text(String(data.locationCount), M + 340, y + 52);

    /* ── CONTENT ── */
    newPage();

    h1('1. Overview');
    para('Store Inventory is a real-time stock management tool. Every item you track has a live "current stock" figure that updates the instant anyone in your team adds a delivery, records a return, or issues material. All activity is recorded in a transaction history and summarised on a statistics dashboard.');
    h2('Core concepts');
    bullet('Item — a product you stock (for example Phenyl, Hand Wash, Floor Wiper). Each item has a unit of measure and an optional minimum threshold.');
    bullet('Stock In — incoming material, either from a supplier (against a bill) or returned unused from a location.');
    bullet('Issue — material given out to a person and a location where it will be used. This reduces stock.');
    bullet('Threshold — the minimum quantity you want to keep. When stock falls to or below it, the item is flagged as needing attention.');
    bullet('Transaction — a permanent record of any stock movement, kept for auditing and exports.');

    h1('2. Getting Started');
    h2('Signing in');
    para('Open the application and sign in with your @maruti.co.in work email. If you do not yet have an account, choose "Create one", register with your work email and a password of at least six characters. Forgotten passwords can be reset from the sign-in screen.');
    h2('Navigation');
    para('The top bar carries icon buttons for the three main areas of the app. Hover over any icon to see its label.');
    bullet('Stock — the home screen: search items, view current levels and low-stock alerts, add stock, issue items, and browse history.');
    bullet('Statistics — KPIs and charts summarising all activity.');
    bullet('Settings — manage your items, suppliers and locations.');
    bullet('Handbook — downloads this PDF at any time.');
    bullet('Sign out — ends your session.');
    callout('Tip', 'On phones the main sections appear as a bottom tab bar so everything is reachable with your thumb.');

    h1('3. Managing Items & Thresholds');
    para('Before you can record any movement you need at least one item, one supplier and one location. These are created on the Settings screen.');
    h2('Adding an item');
    step(1, 'Open Settings from the top bar.');
    step(2, 'In the Items section, type the item name (for example "Phenyl").');
    step(3, 'Choose the unit of measure — litre, kg, pieces, rolls, and so on.');
    step(4, 'Enter a minimum threshold — the level at which you want to be warned to re-order. Leave it as 0 if you do not want a threshold.');
    step(5, 'Select Add. The item now appears with a live stock figure of zero.');
    callout('What the threshold does', 'When an item\'s current stock is at or below its threshold it is highlighted on the Stock screen under "Needs Attention" and counted in the low-stock KPI on the Statistics screen. This is your re-order signal.');
    h2('Editing or removing');
    para('Deleting an item removes it from the dropdowns but keeps its past transactions for the audit trail. Suppliers and locations can be removed the same way from their own sections.');

    h1('4. Adding Incoming Stock');
    para('Use the Add Stock tab on the Stock screen to record material arriving into the store.');
    h2('From a supplier');
    step(1, 'Open the Stock screen and select the "Add Stock" tab.');
    step(2, 'Choose the item and enter the quantity received.');
    step(3, 'In Source, pick the supplier who delivered the material.');
    step(4, 'Enter the bill or invoice number for the delivery.');
    step(5, 'Select Add to Stock. The current stock rises immediately and a Stock-In record is created.');
    h2('Recording a return (unused material)');
    para('Sometimes material that was issued comes back because it was not used. Record this so your stock figure stays accurate.');
    step(1, 'In the Add Stock tab, choose the item and quantity being returned.');
    step(2, 'In Source, choose "Returned (not used)".');
    step(3, 'The bill field is replaced by a "Returned from" location list — pick where the material is coming back from.');
    step(4, 'Select Add to Stock. The quantity is added back and the movement is tagged as a return in the history and statistics.');
    callout('Why track returns separately', 'Returns are shown with their own marker in the history and counted in a dedicated "Returned" KPI, so genuine supplier deliveries are never inflated by material that simply came back unused.');

    h1('5. Issuing Items');
    para('Issuing reduces stock and records who received the material and where it will be used.');
    step(1, 'Open the Stock screen and select the "Issue Item" tab.');
    step(2, 'Choose the item — the dropdown shows the available quantity beside each name.');
    step(3, 'Enter the quantity to issue. You cannot issue more than is in stock.');
    step(4, 'Select the location where the item will be used.');
    step(5, 'Enter the name of the person the item is issued to, and their ID if available.');
    step(6, 'Select Issue Item. Stock falls immediately and the issue is logged with the recipient and location.');
    callout('Accountability', 'Recording the recipient\'s name and ID means every issue is traceable to a person. The Statistics screen aggregates issues by location so you can see where material is consumed.');

    h1('6. The Stock Screen');
    h2('Searching');
    para('The search box at the top of the Stock tab filters the item cards as you type, matching on the item name. Clear the box to see everything again.');
    h2('Needs Attention');
    para('Any item that is out of stock or at/below its threshold is surfaced in a highlighted "Needs Attention" band at the top of the list, so shortages are impossible to miss. Out-of-stock items are marked in red; low-stock items in amber.');
    h2('Reading a stock card');
    bullet('The large number is the current quantity, coloured green (healthy), amber (low) or red (out).');
    bullet('A small bar visualises the level relative to the threshold.');
    bullet('A "Low" or "Out" badge appears on items that need attention.');
    h2('History');
    para('The History tab lists every movement, newest first. Filter by All, Stock In, Returns, or Issues. Each row shows the item, quantity, the supplier/location/person involved, and how long ago it happened.');

    h1('7. Statistics & KPIs');
    para('The Statistics screen turns your transaction history into an at-a-glance dashboard.');
    h2('Key performance indicators');
    bullet('Total Items — number of distinct products tracked.');
    bullet('Total Received — all-time quantity taken in from suppliers.');
    bullet('Total Issued — all-time quantity given out.');
    bullet('Returned — all-time quantity returned unused.');
    bullet('Low / Out of Stock — items at or below threshold, and items at zero.');
    bullet('Transactions — total number of recorded movements.');
    bullet('Active Locations & People — distinct locations and recipients seen in issues.');
    h2('Charts');
    bullet('Stock movements over the last 30 days (in, out and returns).');
    bullet('Top items by usage and current stock levels.');
    bullet('Issues by location and by person.');
    bullet('Received by supplier.');

    h1('8. Exporting Data');
    para('On the Statistics screen, choose Export to download a spreadsheet (.xlsx) containing two sheets: the full transaction history and a snapshot of current stock with thresholds. Use this for record-keeping, audits or sharing with management. This handbook itself can be re-downloaded any time from the Handbook icon.');

    h1('9. Frequently Asked Questions');
    h2('Why can\'t I issue an item?');
    para('You can only issue up to the quantity in stock. If the figure is too low, add stock first. The item, a location and a recipient name are all required.');
    h2('An item is missing from a dropdown.');
    para('It has not been created yet, or it was deleted. Add it in Settings. Deleted items keep their history but no longer appear in dropdowns.');
    h2('A delivery was entered twice.');
    para('Stock figures update live and transactions are permanent. If a mistake is made, correct the balance with an offsetting movement (for example issue the duplicated quantity) and note it for your records.');
    h2('Who can see the data?');
    para('Everyone signed in with an authorised @maruti.co.in account shares the same live inventory, so the whole team always sees the same figures.');

    footer();
    return doc;
  }

  window.generateHandbook = function (data) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('jsPDF not loaded');
    }
    const doc = build(data || {});
    doc.save('store-inventory-handbook.pdf');
  };
})();
