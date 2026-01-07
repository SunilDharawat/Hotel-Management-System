const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class PDFService {
  /**
   * Generate invoice PDF
   */
  static async generateInvoicePDF(invoice) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: "A4" });

        const invoiceDir = path.join(__dirname, "../../invoices");
        if (!fs.existsSync(invoiceDir)) {
          fs.mkdirSync(invoiceDir, { recursive: true });
        }

        const filename = `${invoice.invoice_number}.pdf`;
        const filepath = path.join(invoiceDir, filename);

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        /* ================= HEADER ================= */
        doc.fontSize(20).text("VRINDAVAN PALACE", { align: "center" });
        doc.fontSize(10).text("123 Main Street, City", { align: "center" });
        doc.text("Phone: +91-9876543210 | Email: info@vrindavanpalace.com", {
          align: "center",
        });
        doc.text("GST No: 29ABCDE1234F1Z5", { align: "center" });
        doc.moveDown();

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        doc.fontSize(16).text("TAX INVOICE", { align: "center" });
        doc.moveDown();

        /* ================= INVOICE INFO ================= */
        doc.fontSize(10);
        doc.text(`Invoice No: ${invoice.invoice_number}`, 50, doc.y);
        doc.text(
          `Date: ${new Date(invoice.created_at).toLocaleDateString("en-IN")}`,
          400,
          doc.y - 12
        );

        doc.moveDown();

        /* ================= CUSTOMER ================= */
        doc.fontSize(12).text("Bill To:", { underline: true });
        doc.fontSize(10);
        doc.text(`Name: ${invoice.customer_name}`);
        doc.text(`Phone: ${invoice.customer_phone}`);
        if (invoice.customer_email) {
          doc.text(`Email: ${invoice.customer_email}`);
        }
        doc.moveDown();

        /* ================= ITEMS ================= */
        doc.font("Helvetica-Bold");
        doc.text("Description", 50);
        doc.text("Qty", 300);
        doc.text("Rate", 360);
        doc.text("Amount", 450);
        doc.moveDown();

        doc.font("Helvetica");

        invoice.items.forEach((item) => {
          doc.text(item.description, 50);
          doc.text(item.quantity.toString(), 300);
          doc.text(`₹${item.unit_price}`, 360);
          doc.text(`₹${item.total_price}`, 450);
          doc.moveDown();
        });

        /* ================= TOTAL ================= */
        doc.moveDown();
        doc.font("Helvetica-Bold");
        doc.text(`Total Amount: ₹${invoice.total_amount}`, { align: "right" });

        if (invoice.special_requests) {
          doc.moveDown();
          doc.font("Helvetica");
          doc.text(`Special Requests: ${invoice.special_requests}`);
        }

        doc.end();

        stream.on("finish", () => resolve(filepath));
        stream.on("error", reject);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = PDFService;
