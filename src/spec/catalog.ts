import type { ApiCatalog } from "@bio-mcp/shared/codemode/catalog";

export const idtCatalog: ApiCatalog = {
    name: "IDT SciTools Plus API",
    baseUrl: "https://www.idtdna.com/api/v1",
    version: "1.0",
    auth: "oauth2_client_credentials",
    endpointCount: 10,
    notes:
        "- Requires OAuth2 client credentials (IDT_CLIENT_ID + IDT_CLIENT_SECRET env vars)\n" +
        "- Free IDT account required for API access (register at idtdna.com)\n" +
        "- 500 req/min rate limit\n" +
        "- Codon optimization and complexity scoring are the primary tools\n" +
        "- Code Mode only — use idt_search + idt_execute for all queries",
    endpoints: [
        // Codon Optimization
        {
            method: "POST",
            path: "/CodonOpt/Optimize",
            summary: "Optimize codons for a protein sequence for a target organism. Returns optimized DNA sequence.",
            category: "codon_optimization",
            description:
                "JSON body fields:\n" +
                "- proteinSequences (array, required): Array of { Name, Sequence } objects with protein sequences\n" +
                "- organism (string, required): Target organism (e.g. 'Homo sapiens', 'Escherichia coli K12')\n" +
                "- avoidSequences (array, optional): Array of DNA sequences to avoid",
            body: { contentType: "application/json" },
        },
        // Complexity Scoring
        {
            method: "POST",
            path: "/Complexities/ScreenGBlockSequences",
            summary: "Screen DNA sequences for synthesis complexity and manufacturability",
            category: "complexity",
            description:
                "JSON body fields:\n" +
                "- sequences (array, required): Array of { Name, Sequence } objects with DNA sequences",
            body: { contentType: "application/json" },
        },
        {
            method: "POST",
            path: "/Complexities/ScreenOligoSequences",
            summary: "Screen oligo sequences for synthesis complexity",
            category: "complexity",
            description:
                "JSON body fields:\n" +
                "- sequences (array, required): Array of { Name, Sequence } objects",
            body: { contentType: "application/json" },
        },
        // Oligo Analyzer
        {
            method: "POST",
            path: "/OligoAnalyzer/Analyze",
            summary: "Analyze oligo properties (Tm, GC%, secondary structure, hairpins, self-dimers)",
            category: "oligo_analysis",
            description:
                "JSON body fields:\n" +
                "- Sequence (string, required): DNA/RNA oligo sequence\n" +
                "- NaConc (number, optional): Na+ concentration in mM (default: 50)\n" +
                "- MgConc (number, optional): Mg2+ concentration in mM (default: 0)\n" +
                "- OligoConc (number, optional): Oligo concentration in nM (default: 250)",
            body: { contentType: "application/json" },
        },
        {
            method: "POST",
            path: "/OligoAnalyzer/Hairpin",
            summary: "Predict hairpin structures in an oligo sequence",
            category: "oligo_analysis",
            description:
                "JSON body fields:\n" +
                "- Sequence (string, required): DNA/RNA oligo sequence",
            body: { contentType: "application/json" },
        },
        {
            method: "POST",
            path: "/OligoAnalyzer/SelfDimer",
            summary: "Predict self-dimer structures in an oligo sequence",
            category: "oligo_analysis",
            description:
                "JSON body fields:\n" +
                "- Sequence (string, required): DNA/RNA oligo sequence",
            body: { contentType: "application/json" },
        },
        {
            method: "POST",
            path: "/OligoAnalyzer/HeteroDimer",
            summary: "Predict hetero-dimer structures between two oligo sequences",
            category: "oligo_analysis",
            description:
                "JSON body fields:\n" +
                "- Sequence (string, required): First DNA/RNA oligo sequence\n" +
                "- Sequence2 (string, required): Second DNA/RNA oligo sequence",
            body: { contentType: "application/json" },
        },
        // Organisms
        {
            method: "GET",
            path: "/CodonOpt/AvailableOrganisms",
            summary: "List available organisms for codon optimization",
            category: "codon_optimization",
        },
        // Resuspension Calculator
        {
            method: "POST",
            path: "/OligoAnalyzer/ResuspensionCalculator",
            summary: "Calculate resuspension volume or concentration for an oligo",
            category: "oligo_analysis",
            description:
                "JSON body fields:\n" +
                "- Sequence (string, required): Oligo sequence\n" +
                "- MassInNanograms (number, optional): Mass in ng\n" +
                "- TargetConcentration (number, optional): Target concentration in uM",
            body: { contentType: "application/json" },
        },
    ],
};
