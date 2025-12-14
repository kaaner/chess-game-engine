# AI Code Review Workflows

Bu dizinde iki farklı AI code review workflow'u bulunmaktadır.

## 1. Simple PR Review (`pr-review.yml`)
GitHub Copilot CLI kullanarak basit review yapar.

### Kullanım:
- Otomatik olarak çalışır, ekstra setup gerektirmez
- Her PR açıldığında veya güncellendiğinde tetiklenir

## 2. Advanced AI Review (`ai-code-review.yml`)
OpenAI GPT-4 kullanarak detaylı code review yapar.

### Setup:

1. **OpenAI API Key Oluşturma:**
   - https://platform.openai.com/api-keys adresine gidin
   - Yeni bir API key oluşturun

2. **GitHub Secret Ekleme:**
   - Repository Settings → Secrets and variables → Actions
   - "New repository secret" tıklayın
   - Name: `OPENAI_API_KEY`
   - Value: OpenAI API key'inizi yapıştırın

3. **Labels Oluşturma (Opsiyonel):**
   Workflow otomatik label ekleyebilir. Şu labelları oluşturabilirsiniz:
   - `security-review`
   - `performance`
   - `potential-bug`
   - `ai-approved`
   - `ai-changes-requested`

### Özellikler:
- ✅ Otomatik code quality analizi
- ✅ Security ve performance kontrolü
- ✅ Detaylı geri bildirim
- ✅ Otomatik label ekleme
- ✅ Markdown formatında raporlama

## Alternatif: Anthropic Claude

OpenAI yerine Claude kullanmak isterseniz, `ai-code-review.yml` içindeki API çağrısını şu şekilde değiştirebilirsiniz:

```yaml
# OpenAI yerine Anthropic Claude API
RESPONSE=$(curl -s https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${ANTHROPIC_API_KEY}" \
  -H "anthropic-version: 2023-06-01" \
  -d "{
    \"model\": \"claude-3-opus-20240229\",
    \"max_tokens\": 2000,
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": $(echo "$PROMPT" | jq -Rs .)
      }
    ]
  }")

# Extract response
REVIEW=$(echo "$RESPONSE" | jq -r '.content[0].text')
```

Ve secret olarak `ANTHROPIC_API_KEY` ekleyin.

## Test Etme

1. Bir test PR açın
2. Actions sekmesinde workflow'un çalıştığını göreceksiniz
3. Tamamlandığında PR'a otomatik yorum eklenecektir

## Maliyet

- OpenAI GPT-4: ~$0.03-0.10 per review (diff boyutuna göre)
- Claude Opus: ~$0.05-0.15 per review
- GitHub Actions: Ücretsiz (public repo için)

## Notlar

- AI review'lar yardımcıdır, insan review'unu tamamen değiştirmez
- Büyük PR'lar için token limitleri nedeniyle review kısıtlı olabilir
- Private repo'da GitHub Actions dakika limiti vardır
