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
        "- For codon optimization, prefer the idt_codon_optimize hand-built tool\n" +
        "- For complexity scoring, prefer the idt_complexity_check hand-built tool",
    endpoints: [
        // Codon Optimization
        {
            method: "POST",
            path: "/CodonOpt/Optimize",
            summary: "Optimize codons for a protein sequence for a target organism. Returns optimized DNA sequence.",
            category: "codon_optimization",
            coveredByTool: "idt_codon_optimize",
            bodyParams: [
                { name: "proteinSequences", type: "array", required: true, description: "Array of { Name, Sequence } objects with protein sequences" },
                { name: "organism", type: "string", required: true, description: "Target organism (e.g. 'Homo sapiens', 'Escherichia coli K12')" },
                { name: "avoidSequences", type: "array", required: false, description: "Array of DNA sequences to avoid" },
            ],
        },
        // Complexity Scoring
        {
            method: "POST",
            path: "/Complexities/ScreenGBlockSequences",
            summary: "Screen DNA sequences for synthesis complexity and manufacturability",
            category: "complexity",
            coveredByTool: "idt_complexity_check",
            bodyParams: [
                { name: "sequences", type: "array", required: true, description: "Array of { Name, Sequence } objects with DNA sequences" },
            ],
        },
        {
            method: "POST",
            path: "/Complexities/ScreenOligoSequences",
            summary: "Screen oligo sequences for synthesis complexity",
            category: "complexity",
            bodyParams: [
                { name: "sequences", type: "array", required: true, description: "Array of { Name, Sequence } objects" },
            ],
        },
        // Oligo Analyzer
        {
            method: "POST",
            path: "/OligoAnalyzer/Analyze",
            summary: "Analyze oligo properties (Tm, GC%, secondary structure, hairpins, self-dimers)",
            category: "oligo_analysis",
            bodyParams: [
                { name: "Sequence", type: "string", required: true, description: "DNA/RNA oligo sequence" },
                { name: "NaConc", type: "number", required: false, description: "Na+ concentration in mM (default: 50)" },
                { name: "MgConc", type: "number", required: false, description: "Mg2+ concentration in mM (default: 0)" },
                { name: "OligoConc", type: "number", required: false, description: "Oligo concentration in nM (default: 250)" },
            ],
        },
        {
            method: "POST",
            path: "/OligoAnalyzer/Hairpin",
            summary: "Predict hairpin structures in an oligo sequence",
            category: "oligo_analysis",
            bodyParams: [
                { name: "Sequence", type: "string", required: true, description: "DNA/RNA oligo sequence" },
            ],
        },
        {
            method: "POST",
            path: "/OligoAnalyzer/SelfDimer",
            summary: "Predict self-dimer structures in an oligo sequence",
            category: "oligo_analysis",
            bodyParams: [
                { name: "Sequence", type: "string", required: true, description: "DNA/RNA oligo sequence" },
            ],
        },
        {
            method: "POST",
            path: "/OligoAnalyzer/HeteroDimer",
            summary: "Predict hetero-dimer structures between two oligo sequences",
            category: "oligo_analysis",
            bodyParams: [
                { name: "Sequence", type: "string", required: true, description: "First DNA/RNA oligo sequence" },
                { name: "Sequence2", type: "string", required: true, description: "Second DNA/RNA oligo sequence" },
            ],
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
            bodyParams: [
                { name: "Sequence", type: "string", required: true, description: "Oligo sequence" },
                { name: "MassInNanograms", type: "number", required: false, description: "Mass in ng" },
                { name: "TargetConcentration", type: "number", required: false, description: "Target concentration in uM" },
            ],
        },
    ],
};
