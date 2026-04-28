# Face-API.js Models

This directory contains the face detection models required by the AI Mood Analyzer.

## Required Models

Download the following model files from the face-api.js repository and place them in this directory:

1. `ssd_mobilenetv1_model-weights_manifest.json`
2. `ssd_mobilenetv1_model-weights_shard1`
3. `ssd_mobilenetv1_model-weights_shard2`
4. `age_gender_model-weights_manifest.json`
5. `age_gender_model-weights_shard1`
6. `face_expression_model-weights_manifest.json`
7. `face_expression_model-weights_shard1`
8. `face_landmark68_model-weights_manifest.json`
9. `face_landmark68_model-weights_shard1`

## Download Instructions

### Option 1: Using CDN (Recommended for Production)
The models can be loaded directly from a CDN. Update the model loading code in your component to use:
```javascript
await faceapi.nets.ssdMobilenetv1.loadFromUri('/models/');
```

### Option 2: Download from GitHub
Download models from: https://github.com/vladmandic/face-api/tree/master/model

Copy all `.json` and shard files to this directory.

### Option 3: Using npm Package
```bash
npm install @vladmandic/face-api
```

Then reference the models from node_modules:
```javascript
const modelPath = '/node_modules/@vladmandic/face-api/model/';
await faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath);
```

## File Structure

```
public/models/
├── ssd_mobilenetv1_model-weights_manifest.json
├── ssd_mobilenetv1_model-weights_shard1
├── ssd_mobilenetv1_model-weights_shard2
├── age_gender_model-weights_manifest.json
├── age_gender_model-weights_shard1
├── face_expression_model-weights_manifest.json
├── face_expression_model-weights_shard1
├── face_landmark68_model-weights_manifest.json
├── face_landmark68_model-weights_shard1
└── README.md
```

## Verifying Models

After adding the models, restart your development server and check the browser console. You should see the models loading without 404 errors.

## Troubleshooting

If you see 404 errors for model files:

1. Ensure all model files are in this directory
2. Check file names are exact (case-sensitive)
3. Verify the file paths in your component's `loadFromUri()` call
4. For production (Vercel), ensure files are included in the deployment

## Production Deployment (Vercel)

For Vercel deployments, add to `vercel.json`:
```json
{
  "public": "public",
  "rewrites": [
    {
      "source": "/models/:path*",
      "destination": "/models/:path*"
    }
  ]
}
```

Or ensure `public/models/*` files are not ignored in `.gitignore`.
