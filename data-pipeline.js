const rawData = {
  campaigns: [
    { id: 'c1', name: 'Ramadan Sale',    channel: 'whatsapp', sent: 1200, opened: 1140, replied: 420, revenue: 8400  },
    { id: 'c2', name: 'New Year Offer',  channel: 'email',    sent: 5000, opened: 1800, replied: 210, revenue: 4200  },
    { id: 'c3', name: 'Flash Sale',      channel: 'whatsapp', sent: 800,  opened: 760,  replied: 380, revenue: 7600  },
    { id: 'c4', name: 'Weekly Update',   channel: 'email',    sent: 3000, opened: 690,  replied: 45,  revenue: 900   },
    { id: 'c5', name: 'Product Launch',  channel: 'whatsapp', sent: 2000, opened: 1900, replied: 950, revenue: 19000 },
    { id: 'c6', name: 'Re-engagement',   channel: 'email',    sent: 1500, opened: 450,  replied: 90,  revenue: 1800  },
  ]
};

// Pipeline 1: Compaign Performance metrics
const enriched = rawData.campaigns.map(c => ({
    ...c,
    openRate: Math.round((c.opened / c.sent) * 100),
    replyRate: Math.round((c.replied / c.opened) * 100),
    revenuePerReply: Math.round(c.revenue / (c.replied || 1)),
}));

// Pipeline 2: Top Performing Campaigns (Open rate > 80%)
const topCampaigns = enriched.filter(c => c.openRate > 80).sort((a,b) => b.replyRate - a.replyRate).map(c => ({
    name:c.name, 
    openRate: c.openRate + "%",
    replyRate: c.replyRate + "%";
}));

// Pipeline 3: Channel comparison
const byChannel = enriched.reduce((acc, c) => {
    if(!acc[c.channel]) {
        acc[c.channel] = {
            campaigns: 0,
            totalSent: 0,
            totalRevenue: 0,
            totalReplied: 0
        };
    }
    acc[c.channel].campaigns++;
    acc[c.channel].totalSent += c.sent;
    acc[c.channel].totalRevenue += c.revenue;
    acc[c.channel].totalReplied += c.replied;
    return acc;
    }, {});

// Add averages to channel summary
const channelSummary = Object.entries(byChannel).map(([channel, data]) => ({
  channel,
  ...data,
  avgRevenuePerCampaign: Math.round(data.totalRevenue / data.campaigns),
  overallReplyRate: Math.round((data.totalReplied / data.totalSent) * 100) + '%',
}));

// PIPELINE 4: Best ROI campaign per channel
const bestPerChannel = Object.entries(
    enriched.reduce((acc, c) => {
        if(!acc[c.channel] || c.revenuePerReply > acc[c.channel].revenuePerReply) {
            acc[c.channel] = c;
        }
        return acc
    }, {})
).map(([channel, campaign]) => ({
    channel, bestCampaign: campaign.name}));

    // Log results
console.log('=== TOP CAMPAIGNS ===');
console.table(topCampaigns);
console.log('=== CHANNEL SUMMARY ===');
console.table(channelSummary);
console.log('=== BEST ROI PER CHANNEL ===');
console.table(bestPerChannel);
