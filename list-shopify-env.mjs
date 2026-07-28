for (const [k, v] of Object.entries(process.env)) {
  if (k.includes("SHOPIFY")) {
    const prefix = v ? v.slice(0, 8) : "(empty)";
    console.log(`${k}: ${prefix}... (length ${v?.length ?? 0})`);
  }
}
