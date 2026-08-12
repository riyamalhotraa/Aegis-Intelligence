from eth_account import Account


buyer = Account.create()
recipient = Account.create()

print("\n==============================")
print("AEGIS DEMO BUYER WALLET")
print("==============================")
print("Address:")
print(buyer.address)
print("\nPRIVATE KEY:")
print(buyer.key.hex())

print("\n==============================")
print("AEGIS DEMO RECIPIENT WALLET")
print("==============================")
print("Address:")
print(recipient.address)

print("\nIMPORTANT:")
print("The BUYER private key must NEVER be committed to GitHub.")
print("The recipient only needs its public address.")