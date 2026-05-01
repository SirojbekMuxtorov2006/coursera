import { NextResponse } from "next/server";
import React from "react";
import { requireUser } from "@/lib/server-auth";
import { db } from "@/lib/db";
import { errorToResponse, jsonError } from "@/lib/http";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 12,
    color: "#0b1220",
  },
  border: {
    borderWidth: 2,
    borderColor: "#7c3aed",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "#334155",
  },
  name: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
  },
  course: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#111827",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    color: "#334155",
  },
});

function CertificateDoc(props: {
  learnerName: string;
  courseTitle: string;
  issuedAtIso: string;
  certificateId: string;
}) {
  const { learnerName, courseTitle, issuedAtIso, certificateId } = props;
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.border },
        React.createElement(Text, { style: styles.title }, "Certificate of Completion"),
        React.createElement(
          Text,
          { style: styles.subtitle },
          "This certifies that the learner has successfully completed the course."
        ),
        React.createElement(Text, { style: styles.name }, learnerName),
        React.createElement(Text, { style: styles.course }, courseTitle),
        React.createElement(
          View,
          { style: styles.metaRow },
          React.createElement(
            Text,
            null,
            `Issued: ${new Date(issuedAtIso).toLocaleDateString("en-US")}`
          ),
          React.createElement(Text, null, `ID: ${certificateId}`)
        )
      )
    )
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const session = await requireUser();
    const { certificateId } = await params;

    const cert = await db.certificate.findUnique({
      where: { id: certificateId },
      include: { course: { select: { title: true } }, user: { select: { name: true, email: true } } },
    });

    if (!cert) return jsonError("Certificate not found", 404);
    if (cert.userId !== session.user.id && session.user.role !== "ADMIN") {
      return jsonError("Forbidden", 403);
    }

    const learnerName = cert.user.name || cert.user.email || "Learner";
    const courseTitle = cert.course.title;

    const doc = CertificateDoc({
      learnerName,
      courseTitle,
      issuedAtIso: cert.issuedAt.toISOString(),
      certificateId: cert.id,
    });

    const blob = await pdf(doc).toBlob();
    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=\"certificate-${cert.id}.pdf\"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (e) {
    return errorToResponse(e);
  }
}

