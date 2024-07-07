async function main() {
    let splToken;
    try {
        splToken = await import("@solana/spl-token");
    } catch (err) {
        console.error("Failed to dynamically import @solana/spl-token", err);
        return;
    }

    // Now you can use splToken as needed
    console.log(splToken); // Ensure the entire module is imported correctly
    console.log(splToken.createTokenAccount); // Example usage
}

main();
