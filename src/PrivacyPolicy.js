import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

const DATA = [
  {
    title: 'Privacy Policy',
    content:
      'Last updated: July 28, 2025\n\nThis Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.',
  },
  {
    title: 'Interpretation and Definitions',
    content:
      'Account: A unique account created for You to access our Service.\n\nApplication: JATL, the software provided by the Company.\n\nCompany: JAY ACE TECHNOLOGIES LTD, Delhi, India.\n\nPersonal Data: Information that relates to an identified or identifiable individual.\n\nService: Refers to the Application.',
  },
  {
    title: 'Types of Data Collected',
    content:
      '• Personal Data: name, email, address, etc.\n• Usage Data: IP address, browser info, pages visited, time on page.\n• Device Data: device type, OS, browser version.\n• Location/Camera access (with permission).',
  },
  {
    title: 'Use of Your Personal Data',
    content:
      'We use Your data to:\n- Provide and maintain Service\n- Manage Your Account\n- Contact You\n- Analyze usage and performance\n- Send updates or promotional content',
  },
  {
    title: 'Sharing Your Personal Data',
    content:
      'Your data may be shared:\n• With service providers\n• For business transfers (mergers/acquisitions)\n• With affiliates and partners\n• With your consent',
  },
  {
    title: 'Retention of Data',
    content:
      'We retain Your data only as long as needed to:\n- Comply with laws\n- Resolve disputes\n- Analyze service usage and improve performance',
  },
  {
    title: 'Your Rights',
    content:
      'You can request to:\n- Access, update, or delete your data\n- Contact us for corrections\nNote: Some data may be retained if legally required.',
  },
  {
    title: 'Security of Data',
    content:
      'We use reasonable security measures to protect your data. However, no system is 100% secure.',
  },
  {
    title: 'Third-Party Services',
    content:
      '• Mouseflow: session recording tool\n  Privacy: https://mouseflow.com/privacy/\n\n• FreshDesk: customer support tool\n  Privacy: https://www.freshworks.com/privacy/',
  },
  {
    title: 'Children’s Privacy',
    content:
      'We do not collect personal data from users under 13. If you are a parent and aware of a breach, contact us immediately.',
  },
  {
    title: 'Links to Other Sites',
    content:
      'We are not responsible for the privacy policies of external websites linked through our Service.',
  },
  {
    title: 'Changes to this Privacy Policy',
    content:
      'We may update this policy. Changes will be posted here and dated accordingly. Please check periodically.',
  },
  {
    title: 'Contact Us',
    content:
      'Email: jayacetechnologiesltd@gmail.com\nWebsite: https://www.jatl.co.in\nPhone: 7017170617\nAddress: H No - 12 H 1 Block Jahangir Puri, Delhi - 110033 India',
  },
];

const PrivacyPolicy = () => {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={DATA}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={<View style={styles.topSpacer} />}
      ListFooterComponent={<View style={styles.bottomSpacer} />}
      renderItem={({ item }) => (
        <View style={styles.section}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
        </View>
      )}
    />
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  topSpacer: {
    height: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});


