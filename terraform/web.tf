# Provisions an Azure Storage Account (StorageV2, Standard_LRS) intended for frontend/static site hosting.
# Note: the `static_website` block is marked deprecated by your provider/tooling warning and may require migration
# to the newer provider-supported pattern in future updates.
#
# `data` refers to a Terraform data source:
# - `data.azurerm_resource_group.rg.name` and `.location` read attributes from an existing Azure Resource Group
#   (looked up, not created by this configuration).
data "azurerm_resource_group" "rg" {
  name = var.WEBAPP_RESOURCE_GROUP_NAME
}

resource "azurerm_storage_account" "frontend" {
  name                     = "${var.ENVIRONMENT}ticstorage"
  resource_group_name      = data.azurerm_resource_group.rg.name
  location                 = data.azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }
}
