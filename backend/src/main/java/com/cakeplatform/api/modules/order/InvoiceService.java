package com.cakeplatform.api.modules.order;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) throws DocumentException, IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, outputStream);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        // Header
        Paragraph title = new Paragraph("INVOICE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" ")); // Blank line

        // Shop Details
        document.add(new Paragraph(order.getShop().getBusinessName(), boldFont));
        if (order.getShop().getAddress() != null) {
            document.add(new Paragraph(order.getShop().getAddress(), normalFont));
        }
        document.add(new Paragraph("Phone: " + order.getShop().getPhone(), normalFont));
        document.add(new Paragraph(" ")); // Blank line

        // Order Details
        document.add(new Paragraph("Order No: " + order.getOrderNumber(), normalFont));
        document.add(new Paragraph("Date: " + order.getCreatedAt().toLocalDate().toString(), normalFont));
        document.add(new Paragraph("Customer: " + order.getCustomerName(), normalFont));
        document.add(new Paragraph("Email: " + order.getCustomerEmail(), normalFont));
        document.add(new Paragraph(" "));

        // Items Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{4f, 2f, 2f, 2f});

        addTableHeader(table, boldFont);
        
        for (OrderItem item : order.getItems()) {
            addTableRow(table, item, normalFont);
        }
        document.add(table);
        
        document.add(new Paragraph(" "));
        
        // Summary
        Paragraph subtotal = new Paragraph("Subtotal: $" + order.getSubtotal(), normalFont);
        subtotal.setAlignment(Element.ALIGN_RIGHT);
        document.add(subtotal);
        
        if (order.getDiscountAmount() != null && order.getDiscountAmount().doubleValue() > 0) {
            Paragraph discount = new Paragraph("Discount (" + order.getCouponCode() + "): -$" + order.getDiscountAmount(), normalFont);
            discount.setAlignment(Element.ALIGN_RIGHT);
            document.add(discount);
        }
        
        Paragraph delivery = new Paragraph("Delivery Charge: $" + order.getDeliveryCharge(), normalFont);
        delivery.setAlignment(Element.ALIGN_RIGHT);
        document.add(delivery);
        
        Paragraph total = new Paragraph("Total Amount: $" + order.getTotalAmount(), boldFont);
        total.setAlignment(Element.ALIGN_RIGHT);
        document.add(total);

        document.close();

        return outputStream.toByteArray();
    }

    private void addTableHeader(PdfPTable table, Font font) {
        String[] headers = {"Item", "Unit Price", "Qty", "Total"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, font));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }
    }

    private void addTableRow(PdfPTable table, OrderItem item, Font font) {
        String itemName = item.getProductNameSnapshot();
        if (item.getVariantName() != null) {
            itemName += " (" + item.getVariantName() + ")";
        }
        if (item.getDietaryPreference() != null) {
            itemName += "\n[" + item.getDietaryPreference() + "]";
        }
        if (item.getAddonsSummary() != null && !item.getAddonsSummary().isBlank()) {
            itemName += "\n+ " + item.getAddonsSummary();
        }
        
        table.addCell(new Phrase(itemName, font));
        table.addCell(new Phrase("$" + item.getUnitPrice().toString(), font));
        table.addCell(new Phrase(String.valueOf(item.getQuantity()), font));
        table.addCell(new Phrase("$" + item.getTotalPrice().toString(), font));
    }
}
